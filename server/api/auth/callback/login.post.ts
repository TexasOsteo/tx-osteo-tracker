import { object, string } from 'yup'

const schema = object({
  id_token: string().required(),
})

export default defineEventHandler(async (event) => {
  try {
    const rawBody = await readBody(event)
    const body = await schema.validate(rawBody)
    setCookie(event, useRuntimeConfig().public.cookie_token, body.id_token, {
      // TODO: Security settings for production
    })
    await sendRedirect(event, '/')
  } catch (error: any) {
    // TODO: This should probably redirect to user-friendly error page
    throw createError({
      statusCode: 412,
      statusMessage: error.toString(),
    })
  }
})
