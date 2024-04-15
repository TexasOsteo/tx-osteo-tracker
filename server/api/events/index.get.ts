/**
 * --- API INFO
 * GET /api/events
 * Returns a list of all events
 * --- QUERY PARAMETERS
 * ?after={DATE} - Returns only events after this date
 * ?before={DATE} - Returns only events before this date
 */

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // If the param is not null, attempt to parse it as a number then as a string
  const afterDateParam = url.searchParams.get('after')
  const afterDate = afterDateParam
    ? new Date(Number(afterDateParam) || afterDateParam)
    : undefined

  const beforeDateParam = url.searchParams.get('before')
  const beforeDate = beforeDateParam
    ? new Date(Number(beforeDateParam) || beforeDateParam)
    : undefined

  // Find every event by providing no search filters
  const data = await event.context.prisma.event.findMany({
    where: {
      dateAndTime: {
        gte: afterDate,
        lte: beforeDate,
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
