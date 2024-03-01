import { array, object, string } from 'yup'
import { uploadBlob } from '~/utils/azure'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import {
  createFileValidator,
  validateBody,
  stringified,
} from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/qualifications/uploads
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
  description: string().required(),
  qualifications: stringified(
    array(string().required()).min(1).required(),
  ).required(),
})

export default defineEventHandler(async (event) => {
  const userId = event.context.txOsteoClaims?.sub
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'This endpoint requires authentication',
    })
  }

  // Check how many unprocessed uploads the user has (max of 5)
  if (event.context.txOsteoClaims?.admin !== true) {
    const unprocessed = await event.context.prisma.qualificationUpload.count({
      where: {
        user: {
          id: userId,
        },
        processed: false,
      },
    })
    if (unprocessed >= 5) {
      throw createError({
        statusCode: 400,
        message: 'You have too many unprocessed uploads',
      })
    }
  }

  const body = await validateBody(event, schema, true)

  let qUpload = await event.context.prisma.qualificationUpload.create({
    data: {
      description: body.description,
      processed: false,
      user: {
        connect: {
          id: userId,
        },
      },
      qualifications: parseIDsToPrismaConnectObject(body.qualifications),
    },
    include: {
      qualifications: true,
    },
  })

  // Upload file if included
  if (body.file) {
    const blobInfo = await uploadBlob({
      container: 'qualifications',
      blob: body.file,
      name: qUpload.id,
      options: {
        tags: {
          uploader: userId,
          id: qUpload.id,
        },
      },
    })

    qUpload = await event.context.prisma.qualificationUpload.update({
      where: {
        id: qUpload.id,
      },
      data: {
        fileUrl: blobInfo.url,
      },
      include: {
        qualifications: true,
      },
    })
  }

  return qUpload
})
