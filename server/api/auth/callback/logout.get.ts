/**
 * This endpoint is where Auth0 will redirect the user once they are logged out.
 * It deletes the user's auth token/data and sends them to the homepage.
 */
export default defineEventHandler(async (event) => {
  deleteCookie(event, useRuntimeConfig().public.auth0_token)
  deleteCookie(event, useRuntimeConfig().public.txosteo_token)
  await sendRedirect(event, '/')
})
