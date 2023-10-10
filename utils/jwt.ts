/* eslint-disable import/no-named-as-default-member */
import jwt from 'jsonwebtoken'
import {
  boolean,
  number,
  object,
  string,
  ObjectSchema,
  type AnyObject,
  type InferType,
} from 'yup'
import type { User } from '@prisma/client'
import type { DefaultEvent } from './types'

/**
 * Yup schema for checking the Auth0 JWT has all of the required fields
 */
const Auth0ClaimsSchema = object({
  email: string().required(),
  email_verified: boolean().required(),
  exp: number().required(),
  sub: string().required(),
  sid: string().required(),
})

type Auth0Claims = InferType<typeof Auth0ClaimsSchema>

/**
 * Yup schema for checking if our JWT is valid
 */
const TXOsteoClaimsSchema = object({
  admin: boolean().required(),
  exp: number().required(),
  sub: string().required(),
  sid: string().required(),
})

type TXOsteoClaims = InferType<typeof TXOsteoClaimsSchema>

/**
 * Attempts to verify and parse a JWT for its claims based on a yup schema.
 * @param token JWT
 * @param schema Yup schema
 * @returns Null if the JWT is unverifiable/invalid, otherwise the validated JWT is returned
 */
export function validateJWT<T extends AnyObject>(
  token: string,
  schema: ObjectSchema<T>,
): ReturnType<typeof schema.validateSync> | null {
  try {
    const rawPayload = jwt.verify(token, useRuntimeConfig().AUTH0_SECRET)
    return schema.validateSync(rawPayload)
  } catch {
    return null
  }
}

/**
 * Returns the claims from the Auth0 JWT
 * @param info H3 request event with cookie info, or a token string
 * @returns null if claims are invalid
 */
export function getAuth0Claims(
  info: DefaultEvent | string,
): Auth0Claims | null {
  if (typeof info !== 'string') {
    const cookie = getCookie(info, useRuntimeConfig().public.auth0_token)
    if (!cookie) return null
    info = cookie
  }
  return validateJWT(info, Auth0ClaimsSchema)
}

/**
 * Returns the claims from the JWT for our TXOsteo system
 * @param info H3 request event with cookie info, or a token string
 * @returns null if claims are invalid
 */
export function getTXOsteoJWTClaims(
  info: DefaultEvent | string,
): TXOsteoClaims | null {
  if (typeof info !== 'string') {
    const cookie = getCookie(info, useRuntimeConfig().public.txosteo_token)
    if (!cookie) return null
    info = cookie
  }
  return validateJWT(info, TXOsteoClaimsSchema)
}

/**
 * Creates and signs a JWT for our TXOsteo system
 * @param user Prisma user object (can be incomplete)
 * @param auth0Claims Auth0 Claims object
 * @returns JWT
 */
export function generateTXOsteoJWT(
  user: Pick<User, 'id' | 'isAdmin'>,
  auth0Claims: Auth0Claims,
) {
  const payload: TXOsteoClaims = {
    exp: auth0Claims.exp,
    sid: auth0Claims.sid,
    admin: user.isAdmin,
    sub: user.id,
  }

  return jwt.sign(payload, useRuntimeConfig().AUTH0_SECRET)
}
