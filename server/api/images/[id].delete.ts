import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getBlobServiceClient, getCDNUrl } from '~/utils/azure'
import { BlobInfo } from '~/utils/types'

/**
 * --- API INFO
 * DELETE /api/images/[id]
 * Deletes an image from the Azure storage with the id
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event) // Check if user is admin

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
  const blobClient = await containerClient.getBlobClient(id)

  const { tags } = await blobClient.getTags()

  await containerClient.deleteBlob(id)

  return { name: id, tags, url: getCDNUrl(`/images/${id}`).href } as BlobInfo
})
