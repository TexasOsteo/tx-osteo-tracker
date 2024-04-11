import { string, object, number, date, array, bool } from 'yup'

import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { validateBody } from '~/utils/validation'
// import { id } from 'date-fns/locale'

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
  positions: array(
    object({
      name: string().required(),
      maxCapacity: number().required(),
      prerequisites: array(
        object({
          id: string().required(),
          name: string().required(),
        }).defined(),
      ).defined(),
    }).defined(),
  ).defined(),
  notifyVolunteers: bool().default(true),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  const { notifyVolunteers, ...body } = await validateBody(event, eventSchema)

  const eventListing = await event.context.prisma.event.create({
    data: {
      ...body,
      attendees: parseIDsToPrismaConnectObject(body.attendees),
      signedUpUsers: parseIDsToPrismaConnectObject(body.signedUpUsers),
      positions: {
        create: body.positions.map((position) => ({
          name: position.name,
          maxCapacity: position.maxCapacity,
          currentCapacity: 0,
          prerequisites: {
            connect: position.prerequisites.map((prerequisite) => ({
              id: prerequisite.id,
            })),
          },
        })),
      },
    },
    include: {
      positions: true,
    },
  })

  if (notifyVolunteers) {
    try {
      await $fetch('/api/email/new-event', {
        method: 'POST',
        headers: event.headers,
        body: {
          id: eventListing.id,
        },
      })
    } catch {
      // eslint-disable-next-line no-console
      console.warn('Failed to send new event email')
    }
  }

  return eventListing
})
