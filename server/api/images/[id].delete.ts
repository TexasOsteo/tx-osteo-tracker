import { throwErrorIfNotAdmin } from '~/utils/auth'
import { deleteBlob } from '~/utils/blob'
import { ensureRouteParam } from '~/utils/validation'

/**
 * --- API INFO
 * DELETE /api/images/[id]
 * Deletes an image from the Azure storage with the id
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

  const id = ensureRouteParam(event, 'id')

  return await deleteBlob('images', id)
})
