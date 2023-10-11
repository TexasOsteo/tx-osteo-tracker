import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let user = null
  const {
    id,
    name,
    email,
    password,
    dateOfBirth,
    languages,
    isAdmin,
    qualifications,
    userNotes,
  } = JSON.parse(body)

  if (
    !(
      id &&
      name &&
      email &&
      password &&
      dateOfBirth &&
      languages &&
      isAdmin &&
      qualifications &&
      userNotes
    )
  ) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    })
  }

  user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password,
      dateOfBirth,
      languages,
      isAdmin,
      qualifications,
      userNotes,
    },
  })

  return {
    user,
  }
})
