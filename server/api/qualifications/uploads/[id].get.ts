import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * GET /api/qualifications/uploads/[id]
 * Returns the qualification upload by id
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  // Get the id parameter (the last part of this url)
  const id = ensureRouteParam(event, 'id')

  return await event.context.prisma.qualificationUpload.findUnique({
    where: {
      id,
    },
    include: {
      qualifications: true,
    },
  })
})
