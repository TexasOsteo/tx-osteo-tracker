import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * GET /api/users/qualifications/[id]
 * Returns the user's VerifiedQualifications by id(s)
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  const user = await event.context.prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      verifiedQualifications: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user.verifiedQualifications
})
