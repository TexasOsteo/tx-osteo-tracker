import {
  string,
  object,
  number,
  array,
  boolean,
  date,
  type ObjectSchema,
  type InferType,
} from 'yup'
import { userSchema } from './index.post'
import { ensureRouteParam, validateBody } from '~/utils/validation'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { parseIDsToPrismaSetObject } from '~/utils/prisma-parsing'

/**
 * --- API INFO
 * PUT /api/user/[id]
 * Updates an existing user with id
 * Field are optional, but any specified field will completely overwrite the existing value
 * Returns the updated user
 * ---
 */

const schema: ObjectSchema<Partial<InferType<typeof userSchema>>> = object({
  id: string().optional(),
  auth0Id: string().optional(),
  dateOfBirth: date().optional(),
  name: string().optional(),
  email: string().optional(),
  languages: array(string().defined()).optional(),
  numHours: number().optional(),
  isAdmin: boolean().optional(),
  subscribedEmailCategories: array(string().defined()).optional(),
  userNotes: string().optional(),
  signedUpEvents: array(string().defined()).optional(),
  signedUpPositions: array(string().defined()).optional(),
  eventHistory: array(string().defined()).optional(),
  verifiedQualifications: array(string().defined()).optional(),
  qualificationUploads: array(string().defined()).optional(),
  adminNotes: string().optional(),
})

export default defineEventHandler(async (event) => {
  const id = ensureRouteParam(event, 'id')

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

  const updated = await event.context.prisma.user.update({
    where: {
      id,
    },
    data: {
      ...oldData,
      ...body,
      eventHistory: parseIDsToPrismaSetObject(body.eventHistory),
      signedUpEvents: parseIDsToPrismaSetObject(body.signedUpEvents),
      signedUpPositions: parseIDsToPrismaSetObject(body.signedUpPositions),
      qualificationUploads: parseIDsToPrismaSetObject(
        body.qualificationUploads,
      ),
      verifiedQualifications: parseIDsToPrismaSetObject(
        body.verifiedQualifications,
      ),
      adminNotes: body.adminNotes
        ? { connect: { id: body.adminNotes } }
        : undefined,
    },
  })
  return updated
})
