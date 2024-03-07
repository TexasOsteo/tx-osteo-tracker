import { object, string } from 'yup'
import { throwErrorIfNotAdmin } from '~/utils/auth'
import { validateBody } from '~/utils/validation'

/**
 * --- API INFO
 * POST /api/events/[event id]/register/[user id]
 * Marks a user as an attendee for an event
 */

// const schema = object({
//   code: string().required(),
// })

export default defineEventHandler(async (event) => {
  // const { code } = await validateBody(event, schema)

  // get event code from db
  // code === event.code ??
  // or, if admin, just add the user to the event
  // event.context.txOsteoClaims?.admin

  const eventId = getRouterParam(event, 'id')
  if (!eventId) {
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  let userId = getRouterParam(event, 'user')
  if (!userId) {
    throw createError({
      status: 400,
      message: 'No user id provided',
    })
  }

  const cookieUserId = event.context.txOsteoClaims?.sub
  if (userId === 'me') userId = cookieUserId

  if (cookieUserId !== userId) {
    throwErrorIfNotAdmin(event) // Check if user is admin
  }

  const newEvent = await event.context.prisma.event.update({
    where: { id: eventId },
    data: {
      attendees: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      attendees: true,
      signedUpUsers: true,
    },
  })

  return newEvent
})
