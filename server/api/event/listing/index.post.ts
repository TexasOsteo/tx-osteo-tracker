/* - this end point will store admin input of the future events into database:
      -Name of the event
      -Organizer
      -Location
      -Date
      -Description of the event 
      -... etc

  - UI may look like:
        ------------------
       | List a new event |
        ------------------
        Event Name: .......
        Organizer: ........
        Date: ............
        Location:.........
        Event Description.........
*/

import { string, object, number, date, bool, array } from 'yup'

import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import { throwErrorIfNotAdmin } from '~/utils/auth'

const schema = object({
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
  isSignUpAvailable: bool().required(),
  capacity: number().required(),
  languages: array(string().defined()).defined(),
  prerequisites: array(string().defined()).defined(),
  volunteerPositions: array(string().defined()).defined(),
  attendees: array(string().defined()).defined(),
  signedUpUsers: array(string().defined()).defined(),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  const rawBody = await readBody(event)

  try {
    const body = await schema.validate(rawBody)
    const eventListing = await event.context.prisma.event.create({
      data: {
        ...body,
        attendees: parseIDsToPrismaConnectObject(body.attendees),
        signedUpUsers: parseIDsToPrismaConnectObject(body.attendees),
      },
    })
    return eventListing
  } catch (error: any) {
    throw createError({
      statusCode: 412, // Precondition Failed Error
      statusMessage: error.toString(),
    })
  }
})
