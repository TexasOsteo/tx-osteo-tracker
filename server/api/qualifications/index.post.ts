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
  uploads: array(string().required()).optional(),
  validatedUsers: array(string().required()).optional(),
  positions: array(string().required()).optional(),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const body = await validateBody(event, qualificationsSchema)

  const qualification = await event.context.prisma.qualifications.create({
    data: {
      id: body.id,
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
