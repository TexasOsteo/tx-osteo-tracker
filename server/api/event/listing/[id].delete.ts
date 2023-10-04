import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
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
  try {
    const deleteEvent = await prisma.event.delete({
      where: {
        id,
      },
    })
    return deleteEvent
  } catch (error: any) {
    throw createError({
      statusCode: 412, // Precondition Failed Error
      statusMessage: error.toString(),
    })
  }
})
