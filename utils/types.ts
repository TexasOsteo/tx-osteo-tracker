import type { PrismaClient } from '@prisma/client'
import type { H3Event, EventHandlerRequest } from 'h3'
import type { InferType } from 'yup'
import type { Auth0ClaimsSchema, TXOsteoClaimsSchema } from './jwt'

export type DefaultEvent = H3Event<EventHandlerRequest>

export type Auth0Claims = InferType<typeof Auth0ClaimsSchema>

export type TXOsteoClaims = InferType<typeof TXOsteoClaimsSchema>

/**
 * This shims the normal H3 event context to include the fields that are added
 * in the auth middleware
 */
declare module 'h3' {
  interface H3EventContext {
    auth0Claims: Auth0Claims | null
    txOsteoClaims: TXOsteoClaims | null
    prisma: PrismaClient
  }
}
