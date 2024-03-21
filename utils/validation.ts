import { ValidationError, type AnyObject, type ObjectSchema } from 'yup'
import type { DefaultEvent } from './types'

/**
 * Returns a validated body from an API request.
 * If validation fails, a 400 error is thrown.
 * @param event API request event with body
 * @param schema Yup schema
 * @returns
 */
export async function validateBody<T extends AnyObject>(
  event: DefaultEvent,
  schema: ObjectSchema<T>,
): ReturnType<typeof schema.validate> {
  const rawBody = await readBody(event)
  try {
    return await schema.validate(rawBody)
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
      })
    }
    throw error
  }
}
export function compareCodes(
  inputCode: { value: string },
  fullEventData: { value?: { code?: string } },
) {
  return (
    inputCode.value === fullEventData.value?.code &&
    fullEventData.value?.code !== undefined
  )
}
