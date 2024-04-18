/**
 * --- API INFO
 * GET /api/qualifications
 * Returns a list of all qualifications
 * ---
 */

export default defineEventHandler(async (event) => {
  const quals = await event.context.prisma.qualifications.findMany()
  return quals
})
