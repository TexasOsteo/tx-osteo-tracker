/**
 * --- API INFO
 * GET /api/events
 * Returns a list of all events
 * --- QUERY PARAMETERS
 * ?after={DATE} - Returns only events after this date
 */

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const afterDateParam = url.searchParams.get('after')
  // If the after param is not null, attempt to parse it as a number then as a string
  const afterDate = afterDateParam
    ? new Date(Number(afterDateParam) || afterDateParam)
    : undefined

  // Find every event by providing no search filters
  const data = await event.context.prisma.event.findMany({
    where: {
      dateAndTime: {
        gte: afterDate,
      },
    },
    include: {
      positions: true,
    },
  })
  if (!event.context.txOsteoClaims?.admin) {
    for (const ev of data) {
      ev.code = ''
    }
  }
  return data
})
