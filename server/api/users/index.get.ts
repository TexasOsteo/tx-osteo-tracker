import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * GET /api/users
 * Returns a list of all users
 * ---
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Admin-only endpoint

  const users = await event.context.prisma.user.findMany()
  return users
})
