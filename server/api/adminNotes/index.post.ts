import { object, string } from 'yup'
import { validateBody } from '~/utils/validation'
import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * POST /api/adminNotes
 * Creates a new adminNote with a generated id
 * Returns the newly created adminNote
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  // Validate the request body
  const body = await validateBody(
    event,
    object({
      note: string().required(), // Admin note is required
      userId: string().required(), // User ID is required
    }),
  )

  // Create a new admin note
  const newAdminNote = await event.context.prisma.adminNotes.create({
    data: {
      note: body.note,
      user: {
        // Connect the admin note to the user
        connect: {
          id: body.userId,
        },
      },
    },
  })

  // Return the newly created admin note
  return newAdminNote
})
