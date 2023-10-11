import { string, object, number, array, boolean } from 'yup'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const schema = object({
  id: string().optional(),
  name: string().required(),
  email: string().required(),
  password: string().min(8).required(),
  age: number().required(),
  languages: array(string().defined()).defined(),
  numHours: number().required(),
  isAdmin: boolean().required(),
  qualifications: array(string().defined()).defined(),
  userNotes: array(string().defined()).defined(),
})

export default defineEventHandler(async (event) => {
  const rawBody = await readBody(event)

  try {
    const body = await schema.validate(rawBody)
    const newUser = await prisma.user.create({
      data: {
        ...body,
      },
    })
    return newUser
  } catch (error: any) {
    throw createError({
      statusCode: 412, // Precondition Failed Error
      statusMessage: error.toString(),
    })
  }
})
