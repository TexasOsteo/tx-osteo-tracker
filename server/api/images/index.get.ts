import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getBlobServiceClient, getCDNUrl } from '~/utils/azure'
import { BlobInfo } from '~/utils/types'

/**
 * --- API INFO
 * GET /api/images
 * Returns a list of all images stored in the Azure storage CDN
 * --- QUERY PARAMETERS
 * ?type={STRING} - Returns only images of this type, if specified
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const url = getRequestURL(event)
  const typeParam = url.searchParams.get('type')

  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient('images')

  const blobsInfo: BlobInfo[] = []

  for await (const blob of containerClient.listBlobsFlat({
    includeDeleted: false,
    includeTags: true,
  })) {
    if (!typeParam || blob.tags?.type === typeParam) {
      blobsInfo.push({
        name: blob.name,
        tags: blob.tags ?? {},
        url: getCDNUrl(`/${containerClient.containerName}/${blob.name}`).href,
      })
    }
  }

  return blobsInfo
})
