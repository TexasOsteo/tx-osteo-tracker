import { array, object, string } from 'yup'
import { uploadBlob } from '~/utils/blob'
import { parseIDsToPrismaConnectObject } from '~/utils/prisma-parsing'
import { createFileValidator, validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/qualifications/uploads
 * If included, uploads a qualification file to Azure CDN storage.
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
  qualifications: array(string().required()).min(1).required(),
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

  const body = await validateBody(event, schema)

  let qUpload = await event.context.prisma.qualificationUpload.create({
    data: {
      description: body.description,
      processed: false,
      hasFile: false,
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

  // Connect the new upload to the qualifications table
  for (const id of body.qualifications) {
    await event.context.prisma.qualifications.update({
      where: { id },
      data: {
        uploads: {
          connect: {
            id: qUpload.id,
          },
        },
      },
    })
  }

  // Upload file if included
  if (body.file) {
    await uploadBlob({
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

    // Use another request to update file field in case azure upload fails
    qUpload = await event.context.prisma.qualificationUpload.update({
      where: {
        id: qUpload.id,
      },
      data: {
        hasFile: true,
      },
      include: {
        qualifications: true,
      },
    })
  }

  return qUpload
})
