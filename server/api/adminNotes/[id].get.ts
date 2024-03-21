import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * GET /api/adminNotes/[id]
 * Fetches an admin note by its id
 * Returns the admin note if found, otherwise throws an error
 */
export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  // Get the id parameter (the last part of this url)
  const noteId = getRouterParam(event, 'id')
  if (!noteId) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  // Fetch the admin note by its id
  const adminNote = await event.context.prisma.adminNotes.findUnique({
    where: {
      id: noteId,
    },
  })

  if (!adminNote) {
    throw new Error('Admin note not found')
  }

  // Return the admin note
  return adminNote
})
