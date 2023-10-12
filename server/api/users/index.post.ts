import { string, object, number, array, boolean, date } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/users
 * Creates a new user with a generated id
 * Returns the newly created user
 * ---
 */

const schema = object({
  id: string().optional(),
  auth0_id: string().required(),
  dateOfBirth: date().required(),
  name: string().required(),
  email: string().required(),
  languages: array(string().defined()).defined(),
  numHours: number().required(),
  isAdmin: boolean().required(),
  qualifications: array(string().defined()).defined(),
  userNotes: array(string().defined()).defined(),
})

export default defineEventHandler(async (event) => {
  const body = await validateBody(event, schema)

  const claimedId = event.context.auth0Claims?.sub
  if (claimedId !== body.auth0_id) {
    throwErrorIfNotAdmin(
      event,
      'You must be an admin to create a user other than yourself',
    )
  }
  if (body.isAdmin) {
    throwErrorIfNotAdmin(
      event,
      'You cannot create an admin user without being admin',
    )
  }

  const newUser = await event.context.prisma.user.create({
    data: body,
  })
  return newUser
})
