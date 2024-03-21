import { string, object, number, array } from 'yup'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import { validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * PUT /api/eventPosition/[id]
 * Updates an event position by its id
 */
export default defineEventHandler(async (event) => {
  // Get the id parameter (the last part of this url)
  const positionId = getRouterParam(event, 'id')
  if (!positionId) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No event position id provided',
    })
  }

  // Validate the request body
  const body = await validateBody(
    event,
    object({
      name: string(), // Event position name is optional
      maxCapacity: number(), // Maximum capacity is optional
      prerequisites: array(string().required()), // Prerequisites are optional
      users: array(string().required()), // Users are optional
      eventId: string(), // Event ID is optional
    }),
  )

  // Update and return the event position by its id
  const updatedEventPosition = await event.context.prisma.eventPosition.update({
    where: {
      id: positionId,
    },
    data: {
      name: body.name,
      maxCapacity: body.maxCapacity,
      currentCapacity: {
        increment: body.users?.length,
      },
      prerequisites: parseIDsToPrismaConnectObject(body.prerequisites ?? []),
      users: parseIDsToPrismaConnectObject(body.users ?? []),
      event: body.eventId
        ? {
          // Connect the event position to the event
          connect: {
            id: body.eventId,
          },
        }
        : {},
    },
  })

  if (!updatedEventPosition) {
    throw new Error('Event position not found')
  }

  return updatedEventPosition
})
