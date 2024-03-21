import { object, boolean } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam, validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * PUT /api/qualifications/uploads/[id]
 * Updates the qualification upload status (processed) by id
 *
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  const body = await validateBody(
    event,
    object({
      processed: boolean().required(),
    }),
  )

  // Update the QualificationUpload
  const updatedQUpload = await event.context.prisma.qualificationUpload.update({
    where: {
      id,
    },
    data: {
      processed: body.processed,
    },
  })

  if (!updatedQUpload) {
    throw new Error('QualificationUpload not found')
  }

  return updatedQUpload
})
