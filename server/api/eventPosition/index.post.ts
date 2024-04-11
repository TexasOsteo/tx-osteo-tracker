import { object, string, number, array } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
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
      prerequisites: array(
        object({ id: string().required(), name: string().required() }),
      ), // Prerequisites are optional
      currentCapacity: number(), // Current capacity is optional
      users: array(string().required()), // Users are optional
      eventId: string().required(), // Event ID is required
    }),
  )

  // Create a new event position
  const newEventPosition = await event.context.prisma.eventPosition.create({
    data: {
      name: body.name,
      maxCapacity: body.maxCapacity,
      prerequisites: {
        connect: body.prerequisites?.map((prerequisite) => ({
          id: prerequisite.id,
        })),
      },
      // Set the current capacity to the number of users if any, or 0
      currentCapacity: body.users ? body.users.length : 0,
      users: parseIDsToPrismaConnectObject(body.users ?? []),
      event: {
        // Connect the event position to the event
        connect: {
          id: body.eventId,
        },
      },
    },
  })

  return newEventPosition
})
