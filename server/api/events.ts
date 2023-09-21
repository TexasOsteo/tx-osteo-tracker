import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async () => {
  const client = new PrismaClient()

  const data = await client.event.findMany()
  return data
})
