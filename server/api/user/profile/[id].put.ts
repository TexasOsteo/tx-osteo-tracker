// update user information

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  // find id
  const id = getRouterParam(event, 'id')
  const userId = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!userId) {
    throw createError({
      status: 404,
      message: 'Not found user id',
    })
  }

  try {
    const body = await readBody(event)
    const updated = prisma.user.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    })
    return updated
  } catch (error: any) {
    throw createError({
      statusCode: 412, // Precondition Failed Error
      statusMessage: error.toString(),
    })
  }
})
