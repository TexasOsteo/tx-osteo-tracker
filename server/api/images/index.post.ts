import { object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { uploadBlob } from '~/utils/azure'
import { createFileValidator, validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/images
 * Body is a multipart form.
 * Uploads an image to the Azure CDN storage
 */

const schema = object({
  file: createFileValidator(
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    5 * 1024 * 1024,
  ).required(),
  type: string().required(),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const { file, type } = await validateBody(event, schema, true)

  return uploadBlob({
    blob: file,
    container: 'images',
    options: {
      tags: {
        type,
      },
      blobHTTPHeaders: {
        blobCacheControl: 'public, max-age=2592000',
      },
    },
  })
})
