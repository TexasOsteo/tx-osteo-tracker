import { object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { setBlobTags } from '~/utils/azure'
import { validateBody } from '~/utils/validation'

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

  // Get the id parameter (the last part of this url)
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No image id provided',
    })
  }

  return await setBlobTags('images', id, body)
})
