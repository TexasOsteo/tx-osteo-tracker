/**
 * --- API INFO
 * GET /api/eventPosition
 * Returns all event positions
 */
export default defineEventHandler(async (event) => {
  // Return all event positions
  return await event.context.prisma.eventPosition.findMany()
})
