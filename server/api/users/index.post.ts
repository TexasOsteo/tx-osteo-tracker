import { string, object, number, array, boolean, date } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { validateBody } from '~/utils/validation'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'

/**
 * --- API INFO
 * POST /api/users
 * Creates a new user with a generated id
 * Returns the newly created user
 * ---
 */

export const userSchema = object({
  id: string().optional(),
  auth0Id: string().optional(),
  dateOfBirth: date().required(),
  name: string().required(),
  email: string().optional(),
  languages: array(string().defined()).defined(),
  numHours: number().required(),
  isAdmin: boolean().required(),
  subscribedEmailCategories: array(string().defined()).defined(),
  userNotes: string().required(),
  signedUpEvents: array(string().defined()).defined(),
  signedUpPositions: array(string().defined()).defined(),
  eventHistory: array(string().defined()).defined(),
  verifiedQualifications: array(string().defined()).defined(),
  qualificationUploads: array(string().defined()).defined(),
  adminNotes: string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await validateBody(event, userSchema)

  const claims = event.context.auth0Claims
  if (!claims) {
    throw createError({
      status: 401,
      statusMessage: 'You are unauthorized',
    })
  }

  if (body.auth0Id && claims?.sub !== body.auth0Id) {
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
    data: {
      ...body,
      auth0Id: body.auth0Id ?? claims.sub,
      email: body.email ?? claims.email,
      eventHistory: parseIDsToPrismaConnectObject(body.eventHistory),
      signedUpEvents: parseIDsToPrismaConnectObject(body.signedUpEvents),
      signedUpPositions: parseIDsToPrismaConnectObject(body.signedUpPositions),
      qualificationUploads: parseIDsToPrismaConnectObject(
        body.qualificationUploads,
      ),
      verifiedQualifications: parseIDsToPrismaConnectObject(
        body.verifiedQualifications,
      ),
      adminNotes: body.adminNotes
        ? { connect: { id: body.adminNotes } }
        : undefined,
    },
  })
  return newUser
})
