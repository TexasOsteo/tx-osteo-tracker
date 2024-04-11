import type { DefaultEvent } from './types'

export function getRealRequestURL(event: DefaultEvent): URL {
  const url = getRequestURL(event)
  const overrideHost = useRuntimeConfig().OVERRIDE_HOST
  if (overrideHost && overrideHost.length > 0) {
    return new URL(url.href.replace(url.hostname, overrideHost))
  }
  return url
}
