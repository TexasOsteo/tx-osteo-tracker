import { throwErrorIfNotAdmin } from '~/utils/auth'
import { deleteBlob } from '~/utils/blob'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * DELETE /api/qualifications/uploads/[id]
 * Deletes the qualification upload by id
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  // Get the id parameter (the last part of this url)
  const id = ensureRouteParam(event, 'id')

  const qUpload = await event.context.prisma.qualificationUpload.delete({
    where: {
      id,
    },
    include: {
      qualifications: true,
    },
  })

  if (qUpload.hasFile) {
    await deleteBlob('qualifications', qUpload.id)
  }

  return qUpload
})
