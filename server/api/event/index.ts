export default defineEventHandler(async (event) => {
  // Find every event by providing no search filters
  const data = await event.context.prisma.event.findMany()
  return data
})
