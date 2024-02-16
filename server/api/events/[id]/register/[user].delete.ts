import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * DELETE /api/events/[event id]/register/[user id]
 * If user id is 'me,' it will update for the currently signed in user
 */

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')
  if (!eventId) {
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  let userId = getRouterParam(event, 'user')
  if (!userId) {
    throw createError({
      status: 400,
      message: 'No user id provided',
    })
  }

  const cookieUserId = event.context.txOsteoClaims?.sub
  if (userId === 'me') userId = cookieUserId

  // Only allow if this is the user, or if the user is an admin
  // Checks by making sure the user ids are the same
  if (cookieUserId !== userId) {
    throwErrorIfNotAdmin(event) // Check if user is admin
  }

  // TODO: Update position capacity
  const newEvent = await event.context.prisma.event.update({
    where: { id: eventId },
    data: {
      signedUpUsers: {
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
