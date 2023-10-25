import {
  string,
  object,
  number,
  array,
  date,
  bool,
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
  capacity: number().optional(),
  attendees: array(string().defined()).optional(),
  signedUpUsers: array(string().defined()).optional(),
  languages: array(string().defined()).optional(),
  prerequisites: array(string().defined()).optional(),
  volunteerPositions: array(string().defined()).optional(),
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

  const updated = event.context.prisma.event.update({
    where: {
      id,
    },
    data: {
      ...oldData,
      ...body,
      attendees: parseIDsToPrismaSetObject(body.attendees),
      signedUpUsers: parseIDsToPrismaSetObject(body.attendees),
    },
  })
  return updated
})
