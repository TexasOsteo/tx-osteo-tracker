import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getRealRequestURL } from '~/utils/server'

/**
 * --- API INFO
 * GET /api/qualifications/uploads
 * Returns a list of all qualification uploads
 * --- QUERY PARAMETERS
 * ?qualification={ID} - Returns only uploads for this qualification
 * ?user={ID} - Returns only uploads for this user
 * ?processed={true/false} - Returns only uploads that have been processed
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const url = getRealRequestURL(event)
  const qualificationParam = url.searchParams.get('qualification')
  const userParam = url.searchParams.get('user')
  const processedParam = url.searchParams.get('processed')

  const uploads = await event.context.prisma.qualificationUpload.findMany({
    where: {
      qualifications: qualificationParam
        ? {
            some: {
              id: qualificationParam,
            },
          }
        : undefined,
      user: userParam
        ? {
            id: userParam,
          }
        : undefined,
      processed:
        processedParam === 'true'
          ? true
          : processedParam === 'false'
          ? false
          : undefined,
    },
    include: {
      qualifications: true,
      user: true,
    },
  })

  return uploads
})
