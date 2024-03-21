import { string, object, array } from 'yup'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import { ensureRouteParam, validateBody } from '~/utils/validation'

import { throwErrorIfNotAdmin } from '~/utils/auth'

/**
 * --- API INFO
 * PUT /api/qualifications/[id]
 * Updates an existing qualifications
 * Returns the newly updated qualification
 * ---
 */

export const qualificationsSchema = object({
  id: string().optional(),
  name: string().optional(),
  uploads: array(string().required()).optional(),
  validatedUsers: array(string().required()).optional(),
  positions: array(string().required()).optional(),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  const body = await validateBody(event, qualificationsSchema)

  const qualification = await event.context.prisma.qualifications.update({
    where: {
      id,
    },
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
