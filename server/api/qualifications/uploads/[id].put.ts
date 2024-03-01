import { array, object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { uploadBlob } from '~/utils/azure'
import { parseIDsToPrismaSetObject } from '~/utils/prisma-parsing'
import {
  createFileValidator,
  validateBody,
  stringified,
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

  // Get the id parameter (the last part of this url)
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No qualification id provided',
    })
  }

  const body = await validateBody(event, schema, true)

  // Upload file if included
  let fileUrl: string | undefined
  if (body.file) {
    const info = await uploadBlob({
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
    fileUrl = info.url
  }

  return await event.context.prisma.qualificationUpload.update({
    where: {
      id,
    },
    data: {
      fileUrl,
      description: body.description,
      qualifications: parseIDsToPrismaSetObject(body.qualifications),
    },
    include: {
      qualifications: true,
    },
  })
})
