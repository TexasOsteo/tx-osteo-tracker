import { getAuth0Domain, getAuth0ManagementToken } from '~/utils/auth'

/**
 * --- API INFO
 * POST /api/email/verification
 * Resend verification email via Auth0
 */
export default defineEventHandler(async (event) => {
  const auth0Id = event.context.auth0Claims?.sub
  if (!auth0Id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be authorzied to use this endpoint',
    })
  }

  if (event.context.auth0Claims?.email_verified) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Your email is already verified',
    })
  }

  const auth0Token = await getAuth0ManagementToken('update:users')
  const res = await $fetch(
    new URL('/api/v2/jobs/verification-email', getAuth0Domain()).href,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${auth0Token.access_token}`,
      },
      body: {
        user_id: auth0Id,
        client_id: useRuntimeConfig().AUTH0_CLIENTID,
        identity: {
          user_id: auth0Id.split('|')[1],
          provider: auth0Id.split('|')[0],
        },
      },
    },
  )

  return res
})
