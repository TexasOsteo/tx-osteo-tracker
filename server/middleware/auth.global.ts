import { getLoginRedirect } from '~/utils/auth'
import { getAuth0Claims, getTXOsteoJWTClaims } from '~/utils/jwt'

type PathFilter = {
  path: string | RegExp
  methods?: string[] // GET by default
}

/**
 * Paths that do not require authentication.
 * Strings are only allowed if it is an exact match
 */
const publicPaths: PathFilter[] = [
  { path: /^\/api\/auth\/.+/, methods: ['GET', 'POST'] },
  { path: '/' },
]

/**
 * Paths that require the user to have admin privileges
 */
const adminPaths: PathFilter[] = [{ path: /^\/.+/, methods: ['DELETE'] }]

export default defineEventHandler(async (event) => {
  const currentUrl = getRequestURL(event)

  // Skip authentication if the path matches a public path filter
  if (
    publicPaths.some((p) => comparePaths(event.method, p, currentUrl.pathname))
  ) {
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

  // Check if the page is admin-only
  if (
    adminPaths.some((p) => comparePaths(event.method, p, currentUrl.pathname))
  ) {
    if (!txOsteoClaims?.admin) {
      throw createError({
        statusCode: 401,
        statusMessage: `You are unauthorized to access this endpoint (must be admin): ${currentUrl.pathname}`,
      })
    }
  }
})

function comparePaths(
  method: string,
  pathFilter: PathFilter,
  currentPath: string,
): boolean {
  if (
    (pathFilter.path instanceof RegExp && pathFilter.path.test(currentPath)) ||
    currentPath === pathFilter.path
  ) {
    // Allow GET request through unless specified
    if (!pathFilter.methods && method === 'GET') return true
    if (pathFilter.methods && pathFilter.methods.includes(method)) return true
  }
  return false
}
