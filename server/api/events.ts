import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async () => {
  const client = new PrismaClient()

  // Find every event by providing no search filters
  const data = await client.event.findMany()
  return data
})
