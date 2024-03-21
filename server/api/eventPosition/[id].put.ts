import { string, object, number, array } from 'yup'
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
      prerequisites: array().of(string()), // Prerequisites are optional
      users: array().of(string()), // Users are optional
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
      currentCapacity: body.users ? body.users.length : 0, // Adjust current capacity to the length of the incoming users, or 0 if users is undefined
      prerequisites: body.prerequisites
        ? {
            // Connect the event position to the prerequisites
            connect: body.prerequisites.map((id) => ({ id })),
          }
        : {},
      users: body.users
        ? {
            // Connect the event position to the users
            connect: body.users.map((id) => ({ id })),
          }
        : {},
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
