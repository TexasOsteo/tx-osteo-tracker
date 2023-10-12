import {
  string,
  object,
  number,
  array,
  boolean,
  date,
  type ObjectSchema,
} from 'yup'
import type { User } from '@prisma/client'
import { validateBody } from '~/utils/validation'
import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * PUT /api/user/[id]
 * Updates an existing user with id
 * Field are optional, but any specified field will completely overwrite the existing value
 * Returns the updated user
 * ---
 */

const schema: ObjectSchema<Partial<User>> = object({
  id: string().optional(),
  auth0_id: string().optional(),
  dateOfBirth: date().optional(),
  name: string().optional(),
  email: string().optional(),
  languages: array(string().defined()).optional(),
  numHours: number().optional(),
  isAdmin: boolean().optional(),
  qualifications: array(string().defined()).optional(),
  userNotes: array(string().defined()).optional(),
})

export default defineEventHandler(async (event) => {
  // find id
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  // Only allow if this is the user, or if the user is an admin
  // It check by making sure the user ids are the same
  if (event.context.txOsteoClaims?.sub !== id) {
    throwErrorIfNotAdmin(event) // Check if user is admin
  }

  const body = await validateBody(event, schema)
  if (body.isAdmin) {
    throwErrorIfNotAdmin(
      event,
      'You cannot create an admin user without being admin',
    )
  }

  const oldData = await event.context.prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!oldData) {
    throw createError({
      status: 404,
      message: 'Not found user id',
    })
  }

  const updated = event.context.prisma.user.update({
    where: {
      id,
    },
    data: {
      ...oldData,
      ...body,
    },
  })
  return updated
})
