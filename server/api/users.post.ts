/* import { Request, Response } from 'express'
import prisma from '@/db'

export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    dateOfBirth,
    languages,
    isAdmin,
    qualifications,
  } = req.body

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        dateOfBirth,
        numHours: 0,
        isAdmin, // Admins are created manually by other admins
        languages,
        qualifications,
      },
    })

    res.status(201).json(user)
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Error creating user' })
  }
}

*/

// import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { parseISO } from 'date-fns'
// import { defineEventHandler, readBody } from 'worktop';

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    name,
    email,
    password,
    dateOfBirth,
    languages,
    isAdmin,
    qualifications,
    userNotes,
  } = JSON.parse(body)
  // console.log(name)

  // npm install date-fns allows for parseISO, which converts string to date
  // typical user input: 1990-01-01 (YYYY-MM-DD), will be stored as 1990-01-01T00:00:00.000Z
  // user will not have to enter time zone
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      dateOfBirth: parseISO(dateOfBirth),
      numHours: 0,
      isAdmin,
      languages,
      qualifications,
      userNotes,
    },
  })

  return {
    user,
  }
})
