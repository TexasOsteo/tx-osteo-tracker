import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * DELETE /api/qualifications/[id]
 * Deletes a qualification with the id
 * Returns the deleted qualifications's info
 * ---
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  // if name is made unique, could delete by name
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No qualification id provided',
    })
  }
  try {
    const deleteQualification =
      await event.context.prisma.qualifications.delete({
        where: {
          id,
        },
      })
    return deleteQualification
  } catch (error: any) {
    throw createError({
      statusCode: 412, // Precondition Failed Error
      statusMessage: error.toString(),
    })
  }
})
