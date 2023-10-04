/* eslint-disable import/no-named-as-default-member */
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const currentUrl = getRequestURL(event)
  const token = getCookie(event, useRuntimeConfig().public.cookie_token)

  if (token) {
    try {
      const claims = jwt.verify(token, useRuntimeConfig().AUTH0_SECRET)
      console.log(claims)
    } catch (error: any) {
      console.log(error)
    }
  } else {
    console.log('User not authenticated!')
  }
})
