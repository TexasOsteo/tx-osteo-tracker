import { PrismaClient } from '@prisma/client'
// import { defineEventHandler, readBody } from 'worktop';

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = JSON.parse(body)
  let user = null

  try {
    user = await prisma.user.delete({
      where: {
        id,
      },
    })
  } catch (error) {}

  return {
    user,
  }
})
