import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getBlob } from '~/utils/blob'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * GET /api/images/[id]
 * Gets the blob information of the image with the id from Azure storage
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const id = ensureRouteParam(event, 'id')

  return await getBlob('images', id)
})
