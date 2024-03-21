import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * GET /api/adminNotes
 * Fetches all admin notes
 * Returns a list of all admin notes
 */
export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  // Fetch all admin notes
  const adminNotes = await event.context.prisma.adminNotes.findMany()

  // Return the list of admin notes
  return adminNotes
})
