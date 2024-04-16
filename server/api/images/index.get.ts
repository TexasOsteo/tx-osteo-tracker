import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getAllBlobs } from '~/utils/blob'
import { getRealRequestURL } from '~/utils/server'

/**
 * --- API INFO
 * GET /api/images
 * Returns a list of all images stored in the Azure storage CDN
 * --- QUERY PARAMETERS
 * ?type={STRING} - Returns only images of this type, if specified
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const url = getRealRequestURL(event)
  const typeParam = url.searchParams.get('type')

  const blobs = await getAllBlobs('images')
  return blobs.filter((blob) => !typeParam || blob.tags.type === typeParam)
})
