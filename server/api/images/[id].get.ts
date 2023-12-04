import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getBlobServiceClient, getCDNUrl } from '~/utils/azure'
import { BlobInfo } from '~/utils/types'

/**
 * --- API INFO
 * GET /api/images/[id]
 * Gets the blob information of the image with the id from Azure storage
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  // Get the id parameter (the last part of this url)
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No image id provided',
    })
  }

  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient('images')
  const blobClient = containerClient.getBlobClient(id)

  const { tags } = await blobClient.getTags()

  return {
    name: id,
    tags,
    url: getCDNUrl(`/images/${id}`).href,
  } as BlobInfo
})
