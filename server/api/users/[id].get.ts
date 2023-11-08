import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * GET /api/users/[id]
 * Returns the user with the id
 * --- QUERY PARAMETERS
 * ?includeAttended={true/false} - If true, includes all events that this user attended
 * ?includeSignedUp={true/false} - If true, includes all events that this user has signed up for
 */

// api/user/profile/[id]
// Retrieve a user's profile
export default defineEventHandler(async (event) => {
  // Get the id parameter (the last part of this url)
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  // Only allow if this is the user, or if the user is an admin
  // Checks by making sure the user ids are the same
  if (event.context.txOsteoClaims?.sub !== id) {
    throwErrorIfNotAdmin(event) // Check if user is admin
  }

  const url = getRequestURL(event)
  const includeAttended = url.searchParams.get('includeAttended') === 'true'
  const includeSignedUp = url.searchParams.get('includeSignedUp') === 'true'

  const userInfo = await event.context.prisma.user.findFirst({
    where: {
      id,
    },
    include:
      includeAttended || includeSignedUp
        ? { eventHistory: includeAttended, signedUpEvents: includeSignedUp }
        : undefined,
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
