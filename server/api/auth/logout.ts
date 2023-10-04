export default defineEventHandler(async (event) => {
  const domain = useRuntimeConfig().AUTH0_DOMAIN
  const redirectUrl = new URL(
    '/oidc/logout',
    domain.startsWith('https://') ? domain : `https://${domain}`,
  )

  const currentUrl = getRequestURL(event)
  const redirectUri = new URL('/api/auth/callback/logout', currentUrl.origin)

  const token = getCookie(event, useRuntimeConfig().public.cookie_token)
  if (!token) {
    throw createError({
      status: 401,
      statusMessage: 'You are not authenticated so you cannot log out.',
    })
  }

  redirectUrl.searchParams.append('post_logout_redirect_uri', redirectUri.href)
  redirectUrl.searchParams.append('id_token_hint', token)
  redirectUrl.searchParams.append(
    'client_id',
    useRuntimeConfig().AUTH0_CLIENTID,
  )
  // TODO: change nonce
  redirectUrl.searchParams.append('nonce', 'test')

  await sendRedirect(event, redirectUrl.href)
})
