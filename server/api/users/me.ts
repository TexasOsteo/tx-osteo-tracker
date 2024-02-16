/**
 * --- API INFO
 * GET /auth/me
 * Returns the currently signed in user
 */

export default defineEventHandler(async (event) => {
  const claims = event.context.auth0Claims
  if (!claims) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You are unauthorized',
    })
  }

  const user = await event.context.prisma.user.findUnique({
    where: { auth0Id: claims.sub },
    include: {
      eventHistory: true,
      signedUpEvents: true,
      adminNotes: event.context.txOsteoClaims?.admin === true,
      qualificationUploads: true,
      signedUpPositions: true,
      verifiedQualifications: true,
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: `User by Auth0 id "${claims.sub}" not found.`,
    })
  }

  return user
})
