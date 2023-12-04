import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * DELETE /api/events/[event id]/attendance/[user id]
 * Removes an attendee from an event
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const eventId = getRouterParam(event, 'id')
  if (!eventId) {
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  const userId = getRouterParam(event, 'user')
  if (!userId) {
    throw createError({
      status: 400,
      message: 'No user id provided',
    })
  }

  const newEvent = await event.context.prisma.event.update({
    where: { id: eventId },
    data: {
      attendees: {
        disconnect: {
          id: userId,
        },
      },
    },
    include: {
      attendees: true,
      signedUpUsers: true,
    },
  })

  return newEvent
})
