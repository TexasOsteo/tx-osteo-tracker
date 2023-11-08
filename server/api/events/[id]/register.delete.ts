/**
 * --- API INFO
 * DELETE /api/events/[id]/register
 * Deregister the current user for this event
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

  const newEvent = await event.context.prisma.event.update({
    where: { id },
    data: {
      capacity: {
        increment: 1,
      },
      signedUpUsers: {
        disconnect: {
          id: userId,
        },
      },
    },
  })

  return newEvent
})
