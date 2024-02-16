/**
 * Generate a random event code that is 6 characters long.
 */
export function generateEventCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase()
}
