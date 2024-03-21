import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * GET /api/eventPosition
 * Returns all event positions
 */
export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  // Return all event positions
  return await event.context.prisma.eventPosition.findMany()
})
