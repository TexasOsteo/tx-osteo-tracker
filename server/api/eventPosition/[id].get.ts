/**
 * --- API INFO
 * GET /api/eventPosition/[id]
 * Returns an event position by its id
 */

export default defineEventHandler(async (event) => {
  // Get the id parameter (the last part of this url)
  const positionId = getRouterParam(event, 'id')
  if (!positionId) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  // Find and return the event position by its id
  const eventPosition = await event.context.prisma.eventPosition.findUnique({
    where: {
      id: positionId,
    },
  })

  if (!eventPosition) {
    throw new Error('Event position not found')
  }

  return eventPosition
})
