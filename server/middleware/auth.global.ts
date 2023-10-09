import { getLoginRedirect } from '~/utils/auth'
import { getAuth0Claims, getTXOsteoJWTClaims } from '~/utils/jwt'

/**
 * Paths that do not require authentication.
 * Strings are only allowed if it is an exact match
 */
const publicPaths = [/\/api\/auth\/.+/, '/']

export default defineEventHandler(async (event) => {
  const currentUrl = getRequestURL(event)

  // Skip authentication if the path matches a public path filter
  if (publicPaths.some((path) => comparePaths(path, currentUrl.pathname))) {
    return
  }

  const auth0Claims = getAuth0Claims(event)
  const txOsteoClaims = getTXOsteoJWTClaims(event)

  // If no Auth0 claims, they're unauthenticated
  if (!auth0Claims) {
    // Throw an error if they are trying to access an endpoint.
    // Redirect them if they are trying to reach a page
    if (currentUrl.pathname.startsWith('/api')) {
      throw createError({
        statusCode: 401,
        statusMessage: `You are unauthorized to access this endpoint: ${currentUrl.pathname}`,
      })
    } else if (!txOsteoClaims) {
      // TODO: Send them to new user page
      await sendRedirect(event, getLoginRedirect(event))
    } else {
      await sendRedirect(event, getLoginRedirect(event))
    }
  }
})

function comparePaths(
  filterPath: string | RegExp,
  currentPath: string,
): boolean {
  if (typeof filterPath === 'string') return filterPath === currentPath
  return filterPath.test(currentPath)
}
