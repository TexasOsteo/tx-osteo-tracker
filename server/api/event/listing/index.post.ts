/* - this end point will store admin input of the future events into database:
      -Name of the event
      -Organizer
      -Location
      -Date
      -Description of the event 

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

//install joi library: npm install joi
//install joi/date extensionlibrary: npm install @joi/date
import DateExtension from '@joi/date'
import JoiImport from 'joi'

import { PrismaClient } from '@prisma/client'

const Joi = JoiImport.extend(DateExtension) as typeof JoiImport
const prisma = new PrismaClient()
//validate data
const schema = Joi.object({
  name: Joi.array().items(Joi.string()).required(),
  organizer: Joi.array().items(Joi.string()).required(),
  dateTime: Joi.date().format('DD-MM-YYYY').greater('now').required(),
  location: Joi.array().items(Joi.string()).required(),
  description: Joi.array().items(Joi.string()).required(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { error, value } = await schema.validate(body)

  if (error) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    })
  }
  const { name, organizer, dateTime, location, description } = body

  const eventListing = await prisma.eventCreation.create({
    data: {
      name,
      organizer,
      dateTime,
      location,
      description,
    },
  })
  return eventListing
})
