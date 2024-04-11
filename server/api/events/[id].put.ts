import {
  string,
  object,
  number,
  array,
  date,
  ObjectSchema,
  type InferType,
} from 'yup'
import type { eventSchema } from './index.post'
import { validateBody } from '~/utils/validation'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { parseIDsToPrismaSetObject } from '~/utils/prisma-parsing'

/**
 * --- API INFO
 * PUT /api/events/[id]
 * Updates an existing event with id
 * Field are optional, but any specified field will completely overwrite the existing value
 * The 'attendees' and 'signedUpUsers' fields accepts user ids
 * Returns the updated event
 * ---
 */

// The TypeScript type inferred from the Yup schema is incomplete, so we need to define it manually
type Position = {
  id?: string // new positions will not have an id
  name: string
  currentCapacity?: number // new positions will not have a currentCapacity, initalize to 0 upon creation
  maxCapacity: number
  eventId?: string
  prerequisites: { id?: string; name: string }[]
}

const positionSchema = object({
  id: string().optional(), // new positions will not have an id
  name: string().required(),
  currentCapacity: number().optional(),
  maxCapacity: number().required(),
  eventId: string().optional(),
  prerequisites: array(
    object({
      id: string().required(),
      name: string().required(),
    }),
  ).optional(),
})

const schema: ObjectSchema<Partial<InferType<typeof eventSchema>>> = object({
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
  code: string().required(),
  attendees: array(string().defined()).optional(),
  signedUpUsers: array(string().defined()).optional(),
  languages: array(string().defined()).optional(),
  positions: array(positionSchema).optional(),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  // find id
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  const oldData = await event.context.prisma.event.findUnique({
    where: {
      id,
    },
  })
  if (!oldData) {
    throw createError({
      status: 404,
      message: 'Not found event id',
    })
  }

  const body = await validateBody(event, schema)

  // get current positions, will be used to determine if a position is being updated/created/deleted
  // essentially, spot the difference between the oldData and the new formData

  const positions: Position[] = body.positions || []
  // Spot the difference: update and create

  for (const position of positions) {
    const prerequisites = position.prerequisites.map((prerequisite) => ({
      id: prerequisite.id,
      name: prerequisite.name,
    }))

    // Exclude eventId from position object, prisma connects the event to the position using the event id
    // but it should not be included in the position object

    const { eventId: _, ...positionWithoutEventId } = position // the _ is the discarded field, unused variable

    const positionData = {
      ...positionWithoutEventId,
      currentCapacity: position.currentCapacity || 0,
      prerequisites: {
        connect: prerequisites,
      },
      event: {
        connect: {
          id,
        },
      },
    }

    if (position.id) {
      const oldPosition = await event.context.prisma.eventPosition.findUnique({
        where: {
          id: position.id,
        },
      })

      if (oldPosition) {
        // if the position already exists it should be updated, otherwise it should be created
        // update existing position
        await event.context.prisma.eventPosition.update({
          where: {
            id: position.id,
          },
          data: positionData,
        })
      } else {
        // create new position
        await event.context.prisma.eventPosition.create({
          data: positionData,
        })
      }
    } else {
      try {
        const newPosition = await event.context.prisma.eventPosition.create({
          data: positionData,
          include: {
            prerequisites: true,
          },
        })
      } catch (error) {
        console.error('Error creating position:', error)
      }
    }
  }

  // Spot the difference: delete

  const oldPositions = await event.context.prisma.eventPosition.findMany({
    where: {
      eventId: id,
    },
  })

  for (const oldPosition of oldPositions) {
    if (!positions.find((position) => position.id === oldPosition.id)) {
      await event.context.prisma.eventPosition.delete({
        where: {
          id: oldPosition.id,
        },
      })
    }
  }

  const { positions: bodyPositions, ...restBody } = body // exclude positions from the rest of the body, its already handled ^, update rest of event

  const updated = await event.context.prisma.event.update({
    where: {
      id,
    },
    data: {
      ...oldData,
      ...restBody,
      attendees: parseIDsToPrismaSetObject(body.attendees),
      signedUpUsers: parseIDsToPrismaSetObject(body.signedUpUsers),
    },
    include: {
      positions: true,
    },
  })
  return updated
})
