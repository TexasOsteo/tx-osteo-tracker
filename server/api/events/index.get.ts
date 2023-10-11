/**
 * --- API INFO
 * GET /api/events
 * Returns a list of all events
 * ---
 */

export default defineEventHandler(async (event) => {
  // Find every event by providing no search filters
  const data = await event.context.prisma.event.findMany()
  return data
})
