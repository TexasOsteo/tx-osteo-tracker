import { getLogoutRedirect } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, useRuntimeConfig().public.auth0_token)
  if (!token) {
    throw createError({
      status: 401,
      statusMessage: 'You are not authenticated so you cannot log out.',
    })
  }

  const redirectUrl = getLogoutRedirect(event, token)
  await sendRedirect(event, redirectUrl)
})
