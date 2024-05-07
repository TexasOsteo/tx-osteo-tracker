import { InvocationContext } from '@azure/functions'
import { sign } from 'jsonwebtoken'

/**
 * Returns the full url for an endpoint and logs any errors.
 * @param path
 * @param context
 * @returns Null if error
 */
export function getEndpoint(
  path: string,
  context: InvocationContext,
): URL | null {
  try {
    return new URL(path, process.env.HOST_ORIGIN)
  } catch (err) {
    context.log(
      'Failed to parse URL with environment variable. Make sure it is defined correctly.',
    )
    context.log(err)
    return null
  }
}

/**
 * Gets the authorization bearer header for the Azure function and logs any errors.
 * @param context
 * @returns Null if error
 */
export function getAuthToken(context: InvocationContext): string | null {
  const secret = process.env.AUTH0_SECRET
  if (!secret) {
    context.log('Failed to get AUTH0_SECRET from environment variables.')
    return null
  }
  try {
    return sign(
      { sub: context.functionName, admin: true },
      process.env.AUTH0_SECRET,
    )
  } catch (err) {
    context.log('Failed to sign JWT with AUTH0_SECRET.')
    context.log(err)
    return null
  }
}

/**
 * Sends an authenticated post request to the specified endpoint and logs any errors.
 * @param endpoint
 * @param context
 * @returns Null if request fails, response data if successful
 */
export async function postToApi(endpoint: string, context: InvocationContext) {
  const url = getEndpoint(endpoint, context)
  if (!url) return null

  const token = getAuthToken(context)
  if (!token) return null

  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (!res.ok) {
      context.log(`Sent request to ${endpoint}, but received an error.`)
      context.log('Status:', res.status, res.statusText)
      try {
        context.log('Body:', await res.text())
      } catch (_) {}
      return null
    }

    return await res.json()
  } catch (err) {
    context.log(`Failed to send request to ${endpoint}.`)
    context.log(err)
    return null
  }
}
