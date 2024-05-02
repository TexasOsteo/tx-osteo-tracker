/**
 * --- API INFO
 * GET /api/events/[id]
 * Returns the event with id
 */

import { extendWithHiddenEventCodes } from '~/utils/prisma-parsing'

export default defineEventHandler(async (event) => {
  // Get the id parameter (the last part of this url)
  const id = getRouterParam(event, 'id')
  if (!id) {
    // If there is no id, throw a 400 (BAD REQUEST) error
    throw createError({
      status: 400,
      message: 'No event id provided',
    })
  }

  const prisma = extendWithHiddenEventCodes(event)

  // Find the first event with the desired id. null is returned if none found
  const data = await prisma.event.findFirst({
    where: { id },
    include: {
      attendees: {
        include: {
          // Only admins can see users anyway
          adminNotes: true,
        },
      },
      signedUpUsers: {
        include: {
          adminNotes: true,
        },
      },
      positions: {
        include: {
          // get the qualifictions for each position
          prerequisites: true,
          users: {
            select: { id: true },
          },
        },
      },
    },
  })

  if (data == null) {
    // Return 404 (PAGE NOT FOUND) error if the event wasn't found
    throw createError({
      status: 404,
      statusMessage: `No event by this id found: ${id}`,
    })
  }

  if (!event.context.txOsteoClaims?.admin) {
    data.signedUpUsers = []
    data.attendees = []
  }

  return data
})
