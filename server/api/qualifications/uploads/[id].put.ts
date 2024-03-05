import { array, object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { uploadBlob } from '~/utils/azure'
import { parseIDsToPrismaSetObject } from '~/utils/prisma-parsing'
import {
  createFileValidator,
  validateBody,
  stringified,
  ensureRouteParam,
} from '~/utils/validation'

/**
 * --- API INFO
 * PUT /api/qualifications/uploads
 * Body is a multipart form.
 * If included, uploads a qualification file to Azure CDN storage.
 * The qualifications field is a stringified array of qualification IDs.
 */

const schema = object({
  file: createFileValidator(
    [
      'application/pdf',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
    ],
    5 * 1024 * 1024,
  ),
  description: string(),
  qualifications: stringified(array(string().required())),
})

export default defineEventHandler(async (event) => {
  throwErrorIfNotAdmin(event)

  const userId = event.context.txOsteoClaims!.sub

  const id = ensureRouteParam(event, 'id')

  const body = await validateBody(event, schema, true)

  // Upload file if included
  let hasFile: true | undefined
  if (body.file) {
    await uploadBlob({
      container: 'qualifications',
      blob: body.file,
      name: id,
      options: {
        tags: {
          uploader: userId,
          id,
        },
      },
    })
    hasFile = true
  }

  return await event.context.prisma.qualificationUpload.update({
    where: {
      id,
    },
    data: {
      hasFile,
      description: body.description,
      qualifications: parseIDsToPrismaSetObject(body.qualifications),
    },
    include: {
      qualifications: true,
    },
  })
})
