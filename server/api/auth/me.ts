export default defineEventHandler(async (event) => {
  const claims = event.context.auth0Claims
  if (!claims) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You are unauthorized',
    })
  }

  const user = await event.context.prisma.user.findUnique({
    where: { auth0_id: claims.sub },
  })
  console.log(user, claims.sub)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: `User by Auth0 id "${claims.sub}" not found.`,
    })
  }

  return user
})
