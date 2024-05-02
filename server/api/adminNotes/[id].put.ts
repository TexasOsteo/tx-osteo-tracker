import { string, object } from 'yup'
import { ensureRouteParam, validateBody } from '~/utils/validation'
import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * PUT /api/adminNotes/[id]
 * Updates an admin note by its id
 * Returns the updated admin note if found, otherwise throws an error
 */
export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  // Get the id parameter (the last part of this url)
  const adminNoteId = ensureRouteParam(event, 'id')

  // Validate the request body
  const body = await validateBody(
    event,
    object({
      note: string().optional(),
      userId: string().optional(),
    }),
  )

  // Fetch the admin note by its id
  const adminNote = await event.context.prisma.adminNotes.findUnique({
    where: {
      id: adminNoteId,
    },
  })

  if (!adminNote) {
    throw new Error('Admin note not found')
  }

  // Update the admin note
  const updatedAdminNote = await event.context.prisma.adminNotes.update({
    where: {
      id: adminNoteId,
    },
    data: {
      note: body.note,
      user: {
        connect: body.userId
          ? {
              id: body.userId,
            }
          : undefined,
      },
    },
  })

  // Return the updated admin note
  return updatedAdminNote
})
