/**
 * --- API INFO
 * GET /api/events/[id]
 * Returns the event with id
 * ---
 * --- QUERY PARAMETERS
 * ?includeAttendees={true/false} - If true, includes all attendees with event
 * ?includeSignedUp={true/false} - If true, includes all signed up users with event
 */

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

  const url = getRequestURL(event)
  const includeAttendees = url.searchParams.get('includeAttendees') === 'true'
  const includeSignedUp = url.searchParams.get('includeSignedUp') === 'true'

  // Find the first event with the desired id. null is returned if none found
  const data = await event.context.prisma.event.findFirst({
    where: { id },
    include:
      includeAttendees || includeSignedUp
        ? { attendees: includeAttendees, signedUpUsers: includeSignedUp }
        : undefined,
  })

  if (data == null) {
    // Return 404 (PAGE NOT FOUND) error if the event wasn't found
    throw createError({
      status: 404,
      statusMessage: `No event by this id found: ${id}`,
    })
  }

  return data
})
