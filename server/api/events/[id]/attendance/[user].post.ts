import { object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/events/[event id]/register/[user id]
 * Marks a user as an attendee for an event
 */

const schema = object({
  code: string(),
})

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

  if (cookieUserId !== userId) {
    throwErrorIfNotAdmin(event) // Check if user is admin
  }

  const { code } = await validateBody(event, schema)
  const currentEvent = await event.context.prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      attendees: true,
    },
  })
  if (!currentEvent) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Event not found',
    })
  }
  if (currentEvent.code !== code) {
    throwErrorIfNotAdmin(event, 'Invalid event code')
  }

  if (currentEvent.attendees.find((attendee) => attendee.id === userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User is already an attendee',
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

  await event.context.prisma.user.update({
    where: { id: userId },
    data: {
      numHours: {
        increment: newEvent.hoursOffered,
      },
    },
  })

  if (!event.context.txOsteoClaims?.admin) {
    newEvent.code = ''
  }

  return newEvent
})
