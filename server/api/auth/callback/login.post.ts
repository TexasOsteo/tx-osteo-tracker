import { object, string } from 'yup'
import { generateTXOsteoJWT, getAuth0Claims } from '~/utils/jwt'
import { validateBody } from '~/utils/validation'

const schema = object({
  id_token: string().required(),
})

/**
 * This is the endpoint Auth0 sends the user once they log in.
 * It handles the token validation and redirects the user to either the profile setup page or homepage if they have one already.
 */
export default defineEventHandler(async (event) => {
  const body = await validateBody(event, schema)

  const claims = getAuth0Claims(body.id_token)
  if (!claims) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid JWT From Auth0',
    })
  }

  const cookieOptions = {
    expires: new Date(claims.exp * 1000), // Auth0 returns date in seconds since UNIX epoch, but JS needs milliseconds
    secure: true,
  }
  const cookieName = useRuntimeConfig().public.auth0_token
  setCookie(event, cookieName, body.id_token, cookieOptions)

  // Get user info by calling this endpoint with the new id token as the cookie because the user must be authenticated
  // If the user cannot be found, null will be returned
  const user = await $fetch('/api/auth/me', {
    headers: {
      cookie: `${cookieName}=${body.id_token}`,
    },
  }).catch(() => null)

  if (!user) {
    await sendRedirect(event, '/users/new')
  } else {
    // Create a JWT that represents the user in our system
    const jwt = generateTXOsteoJWT(user, claims)
    setCookie(
      event,
      useRuntimeConfig().public.txosteo_token,
      jwt,
      cookieOptions,
    )
    await sendRedirect(event, '/event/listings')
  }
})
