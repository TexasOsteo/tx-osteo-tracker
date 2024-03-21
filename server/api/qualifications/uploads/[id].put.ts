import { array, object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { uploadBlob } from '~/utils/blob'
// import { parseIDsToPrismaSetObject } from '~/utils/prisma-parsing'
import {
  createFileValidator,
  validateBody,
  stringified,
  ensureRouteParam,
} from '~/utils/validation'

/**
 * --- API INFO
 * PUT /api/qualifications/uploads/[id]
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

  // Fetch the current qualificationUpload
  const currentQUpload =
    await event.context.prisma.qualificationUpload.findUnique({
      where: {
        id,
      },
      include: {
        qualifications: true,
      },
    })

  if (!currentQUpload) {
    throw new Error('QualificationUpload not found')
  }

  // Get the ids of the current qualifications
  const currentQualificationIds = currentQUpload.qualifications.map((q) => q.id)

  // Get the ids of the new qualifications
  const newQualificationIds = body.qualifications || []

  // Find the qualifications to disconnect and connect
  const disconnectIds = currentQualificationIds.filter(
    (id) => !newQualificationIds.includes(id),
  )
  const connectIds = newQualificationIds.filter(
    (id) => !currentQualificationIds.includes(id),
  )

  return await event.context.prisma.qualificationUpload.update({
    where: {
      id,
    },
    data: {
      hasFile,
      description: body.description,
      qualifications: {
        disconnect: disconnectIds.map((id) => ({ id })),
        connect: connectIds.map((id) => ({ id })),
      },
    },
    include: {
      qualifications: true,
    },
  })
})
