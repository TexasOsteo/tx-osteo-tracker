import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * GET /api/qualifications
 * Returns a list of all qualifications
 * ---
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Admin-only endpoint

  const quals = await event.context.prisma.qualifications.findMany()
  return quals
})
