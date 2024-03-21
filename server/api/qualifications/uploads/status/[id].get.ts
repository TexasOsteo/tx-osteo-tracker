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
    where: {
      id,
    },
    select: {
      processed: true,
    },
  })

  if (!qUpload) {
    throw new Error('QualificationUpload not found')
  }

  return qUpload.processed
})
