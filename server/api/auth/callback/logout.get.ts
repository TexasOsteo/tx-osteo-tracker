export default defineEventHandler(async (event) => {
  deleteCookie(event, useRuntimeConfig().public.cookie_token)
  await sendRedirect(event, '/')
})
