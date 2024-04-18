import { object, boolean } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import { ensureRouteParam, validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * PUT /api/qualifications/uploads/[id]
 * Approves or rejects a qualification upload
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  const { approved } = await validateBody(
    event,
    object({
      approved: boolean().required(),
    }),
  )

  const updatedQUpload = await event.context.prisma.qualificationUpload.update({
    where: {
      id,
    },
    data: {
      processed: true,
    },
    include: {
      qualifications: true,
    },
  })

  if (approved) {
    const approvedQualifications = updatedQUpload.qualifications.map(
      (q) => q.id,
    )
    await event.context.prisma.user.update({
      where: {
        id: updatedQUpload.userId,
      },
      data: {
        verifiedQualifications: parseIDsToPrismaConnectObject(
          approvedQualifications,
        ),
      },
    })
  }

  if (!updatedQUpload) {
    throw createError({
      statusCode: 404,
      statusMessage: 'QualificationUpload not found',
    })
  }

  return updatedQUpload
})
