import { createHash } from 'node:crypto'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { getBlobServiceClient, getCDNUrl } from '~/utils/azure'
import { BlobInfo } from '~/utils/types'

/**
 * --- API INFO
 * POST /api/images
 * Body is a multipart form.
 * Uploads an image to the Azure CDN storage
 */

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const body = await readFormData(event)
  if (!body.has('type') || !body.has('file')) {
    throw createError({
      statusCode: 400,
      message: 'Request body is missing elements. Must have a file and type.',
    })
  }

  const type = body.get('type')!.toString()
  const file = body.get('file')! as File

  // Convert Web File object to NodeJS Buffer
  const data = Buffer.from(await file.arrayBuffer())
  const hash = createHash('md5').update(data).digest('hex')

  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient('images')
  const blobBlockClient = containerClient.getBlockBlobClient(hash)

  if (await blobBlockClient.exists()) {
    throw createError({
      statusCode: 400,
      message: `A blob with this hash already exists: ${hash}`,
    })
  }

  await blobBlockClient.uploadData(data, {
    tags: {
      type,
    },
    blobHTTPHeaders: {
      blobCacheControl: 'public, max-age=2592000',
      blobContentType: file.type,
    },
  })

  return {
    name: hash,
    tags: {
      type,
    },
    url: getCDNUrl(`/images/${hash}`).href,
  } as BlobInfo
})
