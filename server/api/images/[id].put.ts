import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getBlobServiceClient, getCDNUrl } from '~/utils/azure'
import { BlobInfo } from '~/utils/types'

/**
 * --- API INFO
 * PUT /api/images/[id]
 * Updates a image's tags
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const body = (await readBody(event)) as Record<string, string>
  if (
    typeof body !== 'object' ||
    Object.values(body).some((v) => typeof v !== 'string')
  ) {
    throw createError({
      status: 400,
      message: 'Invalid tag body',
    })
  }

  if (!('type' in body)) {
    throw createError({
      status: 400,
      message: 'Tag body is missing "type" field',
    })
  }

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

  await blobClient.setTags(body)

  return {
    name: id,
    tags: body,
    url: getCDNUrl(`/images/${id}`).href,
  } as BlobInfo
})
