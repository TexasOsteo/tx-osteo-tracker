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

  // Fetch the qualificationUpload
  const qUpload = await event.context.prisma.qualificationUpload.findUnique({
    where: {
      id,
    },
    include: {
      qualifications: true,
    },
  })

  if (!qUpload) {
    throw new Error('QualificationUpload not found')
  }

  // Disconnect the upload from the qualifications
  for (const qualification of qUpload.qualifications) {
    await event.context.prisma.qualifications.update({
      where: { id: qualification.id },
      data: {
        uploads: {
          disconnect: {
            id: qUpload.id,
          },
        },
      },
    })
  }

  // Delete the qualificationUpload
  const deletedQUpload = await event.context.prisma.qualificationUpload.delete({
    where: {
      id,
    },
  })

  if (qUpload.hasFile) {
    await deleteBlob('qualifications', qUpload.id)
  }

  return deletedQUpload
})
