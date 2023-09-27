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

import { PrismaClient } from '@prisma/client'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'

const prisma = new PrismaClient()

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
  const rawBody = await readBody(event)

  try {
    const body = await schema.validate(rawBody)
    const eventListing = await prisma.event.create({
      data: {
        ...body,
        attendees: parseIDsToPrismaConnectObject(body.attendees),
        signedUpUsers: parseIDsToPrismaConnectObject(body.attendees),
      },
    })
    return eventListing
  } catch (error: any) {
    throw createError({
      statusCode: 412,
      statusMessage: error.toString(),
    })
  }
})
