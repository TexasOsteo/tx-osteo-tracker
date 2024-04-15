import ical from 'ical-generator'
import { getRealRequestURL } from '~/utils/server'

/**
 * --- API INFO
 * GET /api/calendar/ical
 * Returns an ICAL file for exporting the event calendar to other programs
 */

export default defineEventHandler(async (event) => {
  const events = await event.context.prisma.event.findMany()
  const calendar = ical({ name: 'Texas Osteoporosis Foundation Events' })

  const url = getRealRequestURL(event)

  events.forEach((e) => {
    calendar.createEvent({
      start: e.dateAndTime,
      end: new Date(e.dateAndTime.getTime() + e.duration * 60 * 60 * 1000),
      summary: e.description,
      location: e.location,
      url: new URL(`/event/${e.id}`, url.origin).href,
      organizer: {
        email: e.email,
        name: e.organizer,
      },
    })
  })

  defaultContentType(event, 'text/calendar')
  return calendar.toString()
})
