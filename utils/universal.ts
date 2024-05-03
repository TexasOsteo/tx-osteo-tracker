/**
 * Generate a random event code that is 6 characters long.
 */
export function generateEventCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase()
}

/**
 * Converts a file to an object with data stored as base64
 */
export function fileToBase64(
  file: File,
): Promise<{ data: string; name: string; type: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve({
        data: (reader.result as string).split(',').pop() as string,
        name: file.name,
        type: file.type,
      })
    }
    reader.readAsDataURL(file)
  })
}
