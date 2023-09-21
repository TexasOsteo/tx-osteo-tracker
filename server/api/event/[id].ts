import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const client = new PrismaClient()
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  const data = await client.event.findFirst({ where: { id } })
  return data
})
