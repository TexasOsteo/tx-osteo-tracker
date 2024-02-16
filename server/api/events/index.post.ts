import { string, object, number, date, array } from 'yup'

import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/events
 * Creates a new event with a generated id
 * The body is a prisma user object, except the 'attendees' and 'signedUpUsers' fields accepts user ids.
 * Similarly, the 'positions' field accepts an array of objects with a name, capacity, and string of qualifications.
 * Returns the newly created event
 */

export const eventSchema = object({
  id: string().optional(),
  name: string().required(),
  organizer: string().required(),
  location: string().required(),
  dateAndTime: date().required(),
  duration: number().required(),
  thumbnail: string().required(),
  hoursOffered: number().required(),
  phoneNumber: string().required(),
  email: string().required(),
  description: string().required(),
  code: string().required(),
  languages: array(string().defined()).defined(),
  attendees: array(string().defined()).defined(),
  signedUpUsers: array(string().defined()).defined(),
  positions: array(string().defined()).defined(),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  const body = await validateBody(event, eventSchema)
  const eventListing = await event.context.prisma.event.create({
    data: {
      ...body,
      attendees: parseIDsToPrismaConnectObject(body.attendees),
      signedUpUsers: parseIDsToPrismaConnectObject(body.signedUpUsers),
      positions: parseIDsToPrismaConnectObject(body.positions),
    },
    include: {
      positions: true,
    },
  })
  return eventListing
})
