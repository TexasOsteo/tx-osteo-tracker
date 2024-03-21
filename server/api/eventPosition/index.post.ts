import { object, string, number, array } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/eventPosition
 * Creates a new event position with a generated id
 * Returns the newly created event position
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  // Validate the request body
  const body = await validateBody(
    event,
    object({
      name: string().required(), // Event position name is required
      maxCapacity: number().required(), // Maximum capacity is required
      prerequisites: array().of(string()), // Prerequisites are optional
      currentCapacity: number(), // Current capacity is optional
      users: array().of(string()), // Users are optional
      eventId: string().required(), // Event ID is required
    }),
  )

  // Create a new event position
  const newEventPosition = await event.context.prisma.eventPosition.create({
    data: {
      name: body.name,
      maxCapacity: body.maxCapacity,
      prerequisites: body.prerequisites
        ? {
            // Connect the event position to the prerequisites
            connect: body.prerequisites.map((id) => ({ id })),
          }
        : {},
      // Set the current capacity to the number of users if any, or 0
      currentCapacity: body.users ? body.users.length : 0,
      users: body.users
        ? {
            // Connect the event position to the users
            connect: body.users.map((id) => ({ id })),
          }
        : {},
      event: {
        // Connect the event position to the event
        connect: {
          id: body.eventId,
        },
      },
    },
  })

  // Return the newly created event position
  return newEventPosition
})
