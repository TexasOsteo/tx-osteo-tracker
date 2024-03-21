import { string, object } from 'yup'
import { validateBody } from '~/utils/validation'
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
  const adminNoteId = getRouterParam(event, 'id')
  if (!adminNoteId) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No adminNote id provided',
    })
  }

  // Validate the request body
  const body = await validateBody(
    event,
    object({
      note: string().required(),
      userId: string().required(),
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
        connect: {
          id: body.userId,
        },
      },
    },
  })

  // Return the updated admin note
  return updatedAdminNote
})
