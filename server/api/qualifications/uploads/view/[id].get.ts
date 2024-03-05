import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getSASUrl } from '~/utils/azure'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * GET /api/qualifications/uploads/view/[id]
 * Redirects to the Azure CDN URL for the qualification upload
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  const uploadCount = await event.context.prisma.qualificationUpload.count({
    where: { id, hasFile: true },
  })
  if (uploadCount === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: `This qualification has no upload, or it doesn't exist`,
    })
  }

  const cdnUrl = await getSASUrl('qualifications', id)
  await sendRedirect(event, cdnUrl.href)
})
