/* eslint-disable no-use-before-define */

import type { Prisma, PrismaClient } from '@prisma/client'
import type { H3Event, EventHandlerRequest } from 'h3'
import type { InferType } from 'yup'
import type { Auth0ClaimsSchema, TXOsteoClaimsSchema } from './jwt'

export type DefaultEvent = H3Event<EventHandlerRequest>

export type Auth0Claims = InferType<typeof Auth0ClaimsSchema>

export type TXOsteoClaims = InferType<typeof TXOsteoClaimsSchema>

export type BlobInfo = {
  url: string
  tags: Record<string, string>
  name: string
}

export type EventWithPositions = Prisma.EventGetPayload<{
  include: { positions: true }
}>

export type FullEvent = Prisma.EventGetPayload<{
  include: { attendees: true; signedUpUsers: true; positions: true }
}>

export type UserWithEvents = Prisma.UserGetPayload<{
  include: {
    eventHistory: true
    signedUpEvents: true
  }
}>

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

/**
 * UseFetch returns serialized objects of types that use SerializeObject<Type>, but this type is not exported so this is copied from their code:
 * https://github.com/remix-run/remix/blob/2248669ed59fd716e267ea41df5d665d4781f4a9/packages/remix-server-runtime/serialize.ts
 */
type NonJsonPrimitive = undefined | Function | symbol
/** JSON serialize [tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) */
type SerializeTuple<T extends [unknown, ...unknown[]]> = {
  [k in keyof T]: T[k] extends NonJsonPrimitive ? null : Serialize<T[k]>
}
type JsonPrimitive =
  | string
  | number
  | boolean
  | String
  | Number
  | Boolean
  | null
type IsAny<T> = 0 extends 1 & T ? true : false
type FilterKeys<TObj extends object, TFilter> = {
  [TKey in keyof TObj]: TObj[TKey] extends TFilter ? TKey : never
}[keyof TObj]
type Serialize<T> = IsAny<T> extends true
  ? any
  : T extends JsonPrimitive
  ? T
  : T extends Map<any, any> | Set<any>
  ? Record<string, never>
  : T extends NonJsonPrimitive
  ? never
  : T extends {
      toJSON(): infer U
    }
  ? U
  : T extends []
  ? []
  : T extends [unknown, ...unknown[]]
  ? SerializeTuple<T>
  : T extends ReadonlyArray<infer U>
  ? (U extends NonJsonPrimitive ? null : Serialize<U>)[]
  : T extends object
  ? SerializeObject<T>
  : never
/** JSON serialize objects (not including arrays) and classes */
export type SerializeObject<T extends object> = {
  [k in keyof Omit<T, FilterKeys<T, NonJsonPrimitive>>]: Serialize<T[k]>
}
