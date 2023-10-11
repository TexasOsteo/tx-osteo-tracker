import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
// import { defineEventHandler, readBody } from 'worktop';

const prisma = new PrismaClient()
export default defineEventHandler(async () => {
  const users = await prisma.user.findMany()

  return {
    users,
  }
})
