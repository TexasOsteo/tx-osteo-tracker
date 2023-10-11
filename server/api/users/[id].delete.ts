import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * DELETE /api/users/[id]
 * Deletes a user with the id
 * Returns the deleted user's info
 * ---
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }
  try {
    const userDeletion = await event.context.prisma.user.delete({
      where: {
        id,
      },
    })
    return userDeletion
  } catch (error: any) {
    throw createError({
      statusCode: 412, // Precondition Failed Error
      statusMessage: error.toString(),
    })
  }
})
