import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * DELETE /api/eventPosition/[id]
 * Deletes an event position by its id
 */
export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

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

  // Delete the event position
  const deletedEventPosition = await event.context.prisma.eventPosition.delete({
    where: {
      id: positionId,
    },
  })

  return deletedEventPosition
})
