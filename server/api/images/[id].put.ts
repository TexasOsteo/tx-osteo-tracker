import { object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { setBlobTags } from '~/utils/blob'
import { ensureRouteParam, validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * PUT /api/images/[id]
 * Updates a image's tags
 */

const schema = object({
  type: string().required(),
}).test('stringRecord', 'Body is not a record of strings', (value) =>
  Object.values(value).every((v) => typeof v === 'string'),
)

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const body = await validateBody(event, schema)

  const id = ensureRouteParam(event, 'id')

  return await setBlobTags('images', id, body)
})
