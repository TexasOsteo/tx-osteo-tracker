import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * DELETE /api/events/[event id]/register/[user id]
 * If user id is 'me,' it will update for the currently signed in user
 */

export default defineEventHandler(async (event) => {
  const eventId = ensureRouteParam(event, 'id')
  let userId = ensureRouteParam(event, 'user')

  const cookieUserId = event.context.txOsteoClaims?.sub
  if (!cookieUserId) {
    throw createError({
      statusCode: 402,
      statusMessage: 'You must be authenticated.',
    })
  }
  if (userId === 'me') userId = cookieUserId

  // Only allow if this is the user, or if the user is an admin
  // Checks by making sure the user ids are the same
  if (cookieUserId !== userId) {
    throwErrorIfNotAdmin(event) // Check if user is admin
  }

  // Need to use findMany since this "where" criteria is not unique
  const positions = await event.context.prisma.eventPosition.findMany({
    where: { eventId, users: { some: { id: userId } } },
  })

  for (const pos of positions) {
    await event.context.prisma.eventPosition.update({
      where: { id: pos.id },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
        currentCapacity: {
          decrement: 1,
        },
      },
    })
  }

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

  if (!event.context.txOsteoClaims?.admin) {
    newEvent.code = ''
  }

  return newEvent
})
