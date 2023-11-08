/**
 * --- API INFO
 * POST /api/events/[id]/register
 * Registers the current user for this event
 */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  const userId = event.context.txOsteoClaims?.sub
  if (!userId) {
    throw createError({
      status: 401,
      message: 'You must be signed in to register for an event',
    })
  }

  const eventData = await event.context.prisma.event.findFirst({
    where: { id },
    include: {
      signedUpUsers: true,
    },
  })

  if (!eventData) {
    throw createError({
      status: 404,
      message: `Could not find event: ${id}`,
    })
  }

  if (eventData.dateAndTime < new Date()) {
    throw createError({
      status: 400,
      message: `This event already happened, so it cannot be registered for`,
    })
  }

  if (eventData.signedUpUsers.length === eventData.capacity) {
    throw createError({
      status: 400,
      message: `This event is at capacity: ${eventData.capacity} signed up users`,
    })
  }

  const newEvent = await event.context.prisma.event.update({
    where: { id },
    data: {
      signedUpUsers: {
        connect: {
          id: userId,
        },
      },
    },
  })

  return newEvent
})
