// It is bad practice to create mulitple prismaClients in a project.
// Each PrismaClient instance is a connection pool to the database.
// The connection pool is limited in size and should be reused across requests.
// Having multiple PrismaClient instances in a project will lead to a connection pool leak.
// In conclusion, having too many open connections to the database will cause the database to crash due to resource exhaustion.

import { PrismaClient } from '@prisma/client'
const prismaC = new PrismaClient()
export default prismaC

// With this implementation, we can import the prisma client from anywhere in the project.
// import prisma from '~/db' or '@/db', as seen in alias in nuxt.config.ts
// ex:
// import prisma from '@/db'
// export default async function handler(req, res) {
//   const users = await prisma.user.findMany()
//  res.status(200).json(users)
// -AS
