import type { TXOsteoClaims } from './types'

/**
 * This function decodes a JWT into its header, payload, and signature parts, but does not verify it.
 * @param jwtStr
 */
export function decodeJWT<T extends Record<string, any>>(jwtStr: string): T {
  const parts = jwtStr.split('.')
  if (parts.length !== 3) throw new Error(`Invalid JWT: ${jwtStr}`)
  return JSON.parse(atob(parts[1]))
}

/**
 * Return true if the signed in user claims to be an admin, false if not or if they're unauthenticated.
 * This only checks if the user claims they are an admin; it does not verify this claim.
 */
export function isSignedInUserAdmin(): boolean {
  const cookieRef = useCookie(useRuntimeConfig().public.txosteo_token)
  const cookieValue = cookieRef.value
  if (!cookieValue) return false
  const claims = decodeJWT<TXOsteoClaims>(cookieValue)
  return claims.admin === true
}
