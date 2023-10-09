import { getLoginRedirect } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const redirectUrl = getLoginRedirect(event)
  await sendRedirect(event, redirectUrl)
})
