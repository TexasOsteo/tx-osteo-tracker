import { string, object, number, array, date, mixed } from 'yup'
import { ensureRouteParam, validateBody } from '~/utils/validation'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import {
  parseIDsToPrismaConnectObject,
  parseIDsToPrismaSetObject,
} from '~/utils/prisma-parsing'

type Position =
  | {
      maxCapacity: number
      name: string
      prerequisites?: string[]
    }
  | {
      id: string
      maxCapacity?: number
      name?: string
      prerequisites?: string[]
    }

/**
 * --- API INFO
 * PUT /api/events/[id]
 * Updates an existing event with id
 * Field are optional, but any specified field will completely overwrite the existing value
 * The 'attendees' field accepts user ids
 * Returns the updated event
 * ---
 */

const schema = object({
  id: string().optional(),
  name: string().optional(),
  organizer: string().optional(),
  location: string().optional(),
  dateAndTime: date().optional(),
  duration: number().optional(),
  thumbnail: string().optional(),
  hoursOffered: number().optional(),
  phoneNumber: string().optional(),
  email: string().optional(),
  description: string().optional(),
  code: string().optional(),
  attendees: array(string().defined()).optional(),
  languages: array(string().defined()).optional(),
  positions: array(
    mixed((v): v is Position => typeof v === 'object')
      .required()
      .test(
        'positions-with-ids-should-be-defined',
        () => 'New positions must have defined attributes',
        (v) => {
          if (!v) return false
          if ('id' in v) {
            return object({
              id: string().required(),
              name: string(),
              maxCapacity: number(),
              prerequisites: array(string().required()),
            }).isValidSync(v)
          }
          console.log(v)
          return object({
            name: string().required(),
            maxCapacity: number().required(),
            prerequisites: array(string().required()),
          }).isValidSync(v)
        },
      ),
  ).defined(),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  const oldData = await event.context.prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      positions: true,
    },
  })
  if (!oldData) {
    throw createError({
      status: 404,
      message: 'Could not find event',
    })
  }

  const { positions, ...body } = await validateBody(event, schema)

  // Initially, get all positions. They will then be removed when iterating over the given ones
  const positionsToRemove = await event.context.prisma.eventPosition.findMany({
    where: {
      eventId: id,
    },
  })

  const signedUpUsers: string[] = []

  for (const pos of positions) {
    if ('id' in pos) {
      const i = positionsToRemove.findIndex((p) => p.id === pos.id)
      if (i >= 0) positionsToRemove.splice(i, 1)
      const updatedPosition = await event.context.prisma.eventPosition.update({
        where: { id: pos.id },
        data: {
          ...pos,
          currentCapacity: undefined, // Make sure that the currentCapacity is not overwritten
          prerequisites: parseIDsToPrismaSetObject(pos.prerequisites),
        },
        include: {
          users: {
            select: {
              id: true,
            },
          },
        },
      })
      updatedPosition.users.forEach((u) => signedUpUsers.push(u.id))
    } else {
      await event.context.prisma.eventPosition.create({
        data: {
          ...pos,
          currentCapacity: 0,
          event: {
            connect: {
              id,
            },
          },
          prerequisites: parseIDsToPrismaConnectObject(pos.prerequisites ?? []),
        },
      })
    }
  }

  const positionIdsToRemove = positionsToRemove.map((p) => p.id)
  await event.context.prisma.eventPosition.deleteMany({
    where: { id: { in: positionIdsToRemove } },
  })

  const updated = await event.context.prisma.event.update({
    where: {
      id,
    },
    data: {
      ...body,
      attendees: parseIDsToPrismaSetObject(body.attendees),
      signedUpUsers: parseIDsToPrismaSetObject(signedUpUsers),
    },
    include: {
      positions: true,
    },
  })
  return updated
})
