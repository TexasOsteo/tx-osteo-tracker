import { throwErrorIfNotAdmin } from '~/utils/auth'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * GET /api/users/[id]
 * Returns the user with the id
 */

// api/user/profile/[id]
// Retrieve a user's profile
export default defineEventHandler(async (event) => {
  const id = ensureRouteParam(event, 'id')

  // Only allow if this is the user, or if the user is an admin
  // Checks by making sure the user ids are the same
  if (event.context.txOsteoClaims?.sub !== id) {
    throwErrorIfNotAdmin(event) // Check if user is admin
  }

  const userInfo = await event.context.prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      eventHistory: true,
      signedUpEvents: true,
      qualificationUploads: true,
      signedUpPositions: true,
      verifiedQualifications: true,
      adminNotes: event.context.txOsteoClaims?.admin === true,
    },
  })

  if (userInfo == null) {
    // Return 404 (PAGE NOT FOUND) error if the user wasn't found
    throw createError({
      status: 404,
      statusMessage: `No event by this id found: ${id}`,
    })
  }

  return userInfo
})
