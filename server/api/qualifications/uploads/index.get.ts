import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * GET /api/qualifications/uploads
 * Returns a list of all qualification uploads
 * --- QUERY PARAMETERS
 * ?qualification={ID} - Returns only uploads for this qualification
 * ?user={ID} - Returns only uploads for this user
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const url = getRequestURL(event)
  const qualificationParam = url.searchParams.get('qualification')
  const userParam = url.searchParams.get('user')

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
    },
    include: {
      qualifications: true,
    },
  })

  return uploads
})
