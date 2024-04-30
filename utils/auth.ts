import { number, object, string } from 'yup'
import type { DefaultEvent } from './types'
import { getRealRequestURL } from './server'

/**
 * Generates the oauth login url for Auth0
 * @param event API request event from user
 * @returns URL String
 */
export function getLoginRedirect(event: DefaultEvent): string {
  const redirectUrl = new URL('/authorize', getAuth0Domain())

  const currentUrl = getRealRequestURL(event)

  const redirectUri = new URL('/api/auth/callback/login', currentUrl.origin)

  redirectUrl.searchParams.append('redirect_uri', redirectUri.href)
  redirectUrl.searchParams.append(
    'client_id',
    useRuntimeConfig().AUTH0_CLIENTID,
  )
  // TODO: change nonce
  redirectUrl.searchParams.append('nonce', 'test')
  redirectUrl.searchParams.append('response_type', 'id_token')
  redirectUrl.searchParams.append('response_mode', 'form_post')
  redirectUrl.searchParams.append('scope', 'openid email')

  return redirectUrl.href
}

/**
 * Generates the oauth logout url for Auth0
 * @param event API request event from user
 * @param token JWT token of the user
 * @returns URL String
 */
export function getLogoutRedirect(event: DefaultEvent, token: string): string {
  const redirectUrl = new URL('/oidc/logout', getAuth0Domain())

  const currentUrl = getRealRequestURL(event)
  const redirectUri = new URL('/api/auth/callback/logout', currentUrl.origin)

  redirectUrl.searchParams.append('post_logout_redirect_uri', redirectUri.href)
  redirectUrl.searchParams.append('id_token_hint', token)
  redirectUrl.searchParams.append(
    'client_id',
    useRuntimeConfig().AUTH0_CLIENTID,
  )
  // TODO: change nonce
  redirectUrl.searchParams.append('nonce', 'test')

  return redirectUrl.href
}

/**
 * @returns The Auth0 issuer domain as a proper url
 */
export function getAuth0Domain(): string {
  const domain = useRuntimeConfig().AUTH0_DOMAIN
  return domain.startsWith('https://') ? domain : `https://${domain}`
}

/**
 * Will throw a 401 (Unauthorized) error if the user does not have a verified TXOsteo JWT token
 * with admin privileges
 * @param event H3 Event
 */
export function throwErrorIfNotAdmin(event: DefaultEvent, message?: string) {
  if (!event.context.txOsteoClaims || !event.context.txOsteoClaims.admin) {
    const currentUrl = getRealRequestURL(event)
    throw createError({
      statusCode: 401,
      message:
        message ??
        `You must be an admin to access this endpoint: ${currentUrl.pathname}`,
    })
  }
}

/**
 * Returns Auth0 machine-to-machine token
 */
export async function getAuth0ManagementToken(scope: string) {
  const res = await $fetch(new URL('/oauth/token', getAuth0Domain()).href, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: useRuntimeConfig().AUTH0_CLIENTID,
      client_secret: useRuntimeConfig().AUTH0_SECRET,
      audience: new URL('/api/v2/', getAuth0Domain()).href,
      scope,
    }),
  })

  return await object({
    access_token: string().required(),
    expires_in: number().required(),
    scope: string().required(),
    token_type: string().required(),
  }).validate(res)
}
