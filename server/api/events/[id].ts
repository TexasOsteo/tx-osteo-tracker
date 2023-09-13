import DummyEvents from './dummy-events.json'

// More info: https://nuxt.com/docs/guide/directory-structure/server#matching-route-parameters

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (id === undefined || !(id in DummyEvents)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event id',
    })
  }

  return DummyEvents[id as keyof typeof DummyEvents]
})
