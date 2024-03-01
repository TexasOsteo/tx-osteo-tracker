import { throwErrorIfNotAdmin } from '~/utils/auth'
import { deleteBlob } from '~/utils/azure'

/**
 * --- API INFO
 * DELETE /api/qualifications/uploads/[id]
 * Deletes the qualification upload by id
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  // Get the id parameter (the last part of this url)
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No qualification id provided',
    })
  }

  const qUpload = await event.context.prisma.qualificationUpload.delete({
    where: {
      id,
    },
    include: {
      qualifications: true,
    },
  })

  if (qUpload.fileUrl) {
    await deleteBlob('qualifications', qUpload.id)
  }

  return qUpload
})
