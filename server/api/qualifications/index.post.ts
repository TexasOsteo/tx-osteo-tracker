import { string, object, array } from 'yup'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import { validateBody } from '~/utils/validation'

import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * POST /api/qualifications
 * Creates a new qualification with a generated id
 * Returns the newly created qualification
 * ---
 */

export const qualificationsSchema = object({
  id: string().optional(),
  name: string().required(),
  uploads: array(string().defined()).defined().optional(),
  validatedUsers: array(string().defined()).defined().optional(),
  positions: array(string().defined()).defined().optional(),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const body = await validateBody(event, qualificationsSchema)

  // Check if a qualification with the same name already exists
  /*
  const existingQualification =
    await event.context.prisma.qualifications.findUnique({
      where: { name: body.name },
    })

  if (existingQualification) {
    throw new Error('A qualification with this name already exists')
  }
  */

  const qualification = await event.context.prisma.qualifications.create({
    data: {
      ...body,
      name: body.name,
      uploads: body.uploads
        ? parseIDsToPrismaConnectObject(body.uploads)
        : undefined,
      validatedUsers: body.validatedUsers
        ? parseIDsToPrismaConnectObject(body.validatedUsers)
        : undefined,
      positions: body.positions
        ? parseIDsToPrismaConnectObject(body.positions)
        : undefined,
    },
  })

  return qualification
})
