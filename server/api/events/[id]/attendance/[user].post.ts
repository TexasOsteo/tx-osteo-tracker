import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * POST /api/events/[event id]/register/[user id]
 * Marks a user as an attendee for an event
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
        connect: {
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
