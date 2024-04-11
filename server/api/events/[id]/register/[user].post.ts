import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/events/[event id]/register/[user id]
 * Registers a user for this event
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

  const cookieUserId = event.context.txOsteoClaims?.sub
  if (!cookieUserId) {
    throw createError({
      statusCode: 402,
      statusMessage: 'You are unauthenticated',
    })
  }

  let userId = ensureRouteParam(event, 'user')
  if (userId === 'me') {
    userId = cookieUserId
  }

  // Only allow if this is the user, or if the user is an admin
  // Checks by making sure the user ids are the same
  if (cookieUserId !== userId) {
    throwErrorIfNotAdmin(event) // Check if user is admin
  }

  const eventData = await event.context.prisma.event.findFirst({
    where: { id: eventId },
    include: {
      signedUpUsers: true,
    },
  })

  if (!eventData) {
    throw createError({
      status: 404,
      message: `Could not find event: ${eventId}`,
    })
  }

  if (eventData.dateAndTime < new Date()) {
    throw createError({
      status: 400,
      message: `This event already happened, so it cannot be registered for`,
    })
  }

  // TODO: Update position capacity and check if it is full

  const newEvent = await event.context.prisma.event.update({
    where: { id: eventId },
    data: {
      signedUpUsers: {
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

  if (!event.context.txOsteoClaims?.admin) {
    newEvent.code = ''
  }

  try {
    await $fetch('/api/email/signup', {
      method: 'POST',
      headers: event.headers,
      body: {
        eventId,
        userId,
      },
    })
  } catch {}

  return newEvent
})
