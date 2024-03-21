import { object, array, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam, validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * PUT /api/users/qualifications/[id]
 * Updates the user's VerifiedQualifications by adding qual id(s)
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  const body = await validateBody(
    event,
    object({
      verified: array().of(string()).required(),
    }),
  )

  const user = await event.context.prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Add qualifications to the user
  const updatedUser = await event.context.prisma.user.update({
    where: {
      id,
    },
    data: {
      verifiedQualifications: {
        connect: body.verified
          .filter((id) => id !== undefined)
          .map((id) => ({ id })),
      },
    },
    include: {
      verifiedQualifications: true,
    },
  })

  return {
    id: updatedUser.id,
    verifiedQualifications: updatedUser.verifiedQualifications,
  }
})
