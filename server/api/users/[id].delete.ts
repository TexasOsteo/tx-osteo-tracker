import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * DELETE /api/users/[id]
 * Deletes a user with the id
 * Returns the deleted user's info
 * ---
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  const id = ensureRouteParam(event, 'id')

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
