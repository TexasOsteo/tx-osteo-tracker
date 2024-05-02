import { object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { extendWithHiddenEventCodes } from '~/utils/prisma-parsing'
import { ensureRouteParam, validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/events/[event id]/register/[user id]
 * Registers a user for this event
 * If user id is 'me,' it will update for the currently signed in user
 */

export default defineEventHandler(async (event) => {
  const { position: positionId } = await validateBody(
    event,
    object({ position: string().required() }),
  )

  const cookieUserId = event.context.txOsteoClaims?.sub
  if (!cookieUserId) {
    throw createError({
      statusCode: 402,
      statusMessage: 'You are unauthenticated',
    })
  }

  const eventId = ensureRouteParam(event, 'id')
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
      positions: {
        include: {
          prerequisites: true,
        },
      },
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

  const position = eventData.positions.find((p) => p.id === positionId)
  if (!position) {
    throw createError({
      statusCode: 404,
      statusMessage: `Unknown position id: ${positionId}`,
    })
  }

  if (position.currentCapacity >= position.maxCapacity) {
    throw createError({
      statusCode: 400,
      statusMessage: 'This position is at capacity.',
    })
  }

  const user = await event.context.prisma.user.findFirst({
    where: { id: userId },
    include: { verifiedQualifications: true },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User does not have data in the database ',
    })
  }

  // manual override: checks user making the request is an admin, if so they can register the user for any position regardless
  const isAdmin = event.context.txOsteoClaims?.admin

  if (
    !isAdmin &&
    position.prerequisites.some(
      (p) => !user.verifiedQualifications.find((q) => q.id === p.id),
    )
  ) {
    throw createError({
      statusCode: 402,
      statusMessage: 'You do not have the qualifications for this position.',
    })
  }

  await event.context.prisma.eventPosition.update({
    where: { id: positionId },
    data: {
      currentCapacity: { increment: 1 },
      users: {
        connect: {
          id: userId,
        },
      },
    },
  })

  const prisma = extendWithHiddenEventCodes(event)
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      signedUpUsers: {
        connect: {
          id: userId,
        },
      },
    },
  })

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

  return updatedEvent
})
