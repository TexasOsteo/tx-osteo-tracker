/**
 * --- API INFO
 * DELETE /api/eventPosition/[id]
 * Deletes an event position by its id
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

  // Fetch the event position with its users
  const eventPosition = await event.context.prisma.eventPosition.findUnique({
    where: {
      id: positionId,
    },
    include: {
      users: true,
    },
  })

  if (!eventPosition) {
    throw new Error('Event position not found')
  }

  // Disconnect the event position from all its users
  for (const user of eventPosition.users) {
    await event.context.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        signedUpPositions: {
          disconnect: {
            id: positionId,
          },
        },
      },
    })
  }

  // Delete the event position
  const deletedEventPosition = await event.context.prisma.eventPosition.delete({
    where: {
      id: positionId,
    },
  })

  return deletedEventPosition
})
