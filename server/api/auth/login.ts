export default defineEventHandler(async (event) => {
  const domain = useRuntimeConfig().AUTH0_DOMAIN
  const redirectUrl = new URL(
    '/authorize',
    domain.startsWith('https://') ? domain : `https://${domain}`,
  )

  const currentUrl = getRequestURL(event)
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

  await sendRedirect(event, redirectUrl.href)
})
