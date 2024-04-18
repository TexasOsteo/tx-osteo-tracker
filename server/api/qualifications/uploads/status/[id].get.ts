import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * GET /api/qualifications/uploads/status/[id]
 * Retrieves the qualification upload status by id
 * Processed true/false
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  // Fetch the QualificationUpload
  const qUpload = await event.context.prisma.qualificationUpload.findUnique({
    where: { id },
    include: {
      user: {
        include: { verifiedQualifications: true },
      },
      qualifications: true,
    },
  })

  if (!qUpload) {
    throw createError({
      statusCode: 404,
      statusMessage: 'QualificationUpload not found',
    })
  }

  return {
    processed: qUpload.processed,
    approved:
      qUpload.processed &&
      qUpload.qualifications.every((q) =>
        qUpload.user.verifiedQualifications.some((v) => v.id === q.id),
      ),
  }
})
