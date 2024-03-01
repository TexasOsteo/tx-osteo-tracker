import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * GET /api/qualifications/uploads/[id]
 * Returns the qualification upload by id
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  // Get the id parameter (the last part of this url)
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No qualification id provided',
    })
  }

  return await event.context.prisma.qualificationUpload.findUnique({
    where: {
      id,
    },
    include: {
      qualifications: true,
    },
  })
})
