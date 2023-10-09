import { PrismaClient } from '@prisma/client'
import { getAuth0Claims } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  const claims = getAuth0Claims(event)
  if (!claims) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You are unauthorized',
    })
  }

  const prisma = new PrismaClient()
  const user = await prisma.user.findUnique({ where: { auth0_id: claims.sub } })
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: `User by Auth0 id "${claims.sub}" not found.`,
    })
  }

  return user
})
