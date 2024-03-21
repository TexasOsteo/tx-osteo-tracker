import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * DELETE /api/adminNotes/[id]
 * Disconnects the adminNote from the User and deletes the adminNote with the id
 * Returns the deleted adminNotes' info
 * ---
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      status: 400,
      message: 'No adminNote id provided',
    })
  }
  try {
    // Delete the admin note
    const deleteAdminNote = await event.context.prisma.adminNotes.delete({
      where: {
        id,
      },
    })
    return deleteAdminNote
  } catch (error: any) {
    throw createError({
      statusCode: 412, // Precondition Failed Error
      statusMessage: error.toString(),
    })
  }
})
