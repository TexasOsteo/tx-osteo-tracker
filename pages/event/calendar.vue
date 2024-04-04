<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import type CalendarView from '~/components/CalendarView.vue'
import type { SerializeObject, EventWithPositions } from '~/utils/types'

type CalendarEvent = {
  id: string
  title: string
  start: number
  end: number
  extendedProps: SerializeObject<EventWithPositions>
}

const eventModalOpen = ref<boolean>(false)
const modalEventProps = ref<CalendarEvent['extendedProps']>()

const exportModalOpen = ref<boolean>(false)
const exportCalendarUrl = ref<string>()
// Wait to use window until on the client
nextTick(
  () =>
    (exportCalendarUrl.value = new URL(
      '/api/calendar/ical',
      window.location.origin,
    ).href),
)

// See: https://fullcalendar.io/docs/events-function
async function getEvents(fetchInfo: {
  start: Date
  end: Date
}): Promise<CalendarEvent[]> {
  const start = fetchInfo.start.getTime()
  const end = fetchInfo.end.getTime()

  // SSR breaks the initial event request, so this forces it to be client-side
  await nextTick()

  const { data: events } = await useFetch(
    `/api/events?after=${start}&before=${end}`,
  )

  const parsedEvents: CalendarEvent[] = (events.value ?? []).map((e) => {
    const eventStart = new Date(e.dateAndTime).getTime()
    return {
      title: e.name,
      id: e.id,
      start: eventStart,
      end: eventStart + e.duration * 60 * 60 * 1000,
      extendedProps: e,
    }
  })
  return parsedEvents
}

function handleEventClick(info: { event: CalendarEvent }) {
  modalEventProps.value = info.event.extendedProps
  eventModalOpen.value = true
}
</script>

<template>
  <EventInfoModal
    v-if="modalEventProps"
    v-model="eventModalOpen"
    :event="modalEventProps"
  />
  <VueFinalModal
    v-model="exportModalOpen"
    class="flex justify-center items-center"
    content-class="flex flex-col lg:6/12 sm:w-8/12 w-full max-h-[90vh] mx-4 p-4 bg-white border rounded-lg space-y-2"
  >
    <div class="flex justify-between items-center">
      <h1 class="font-bold text-lg">Add this link to your calendar program:</h1>
      <button @click="exportModalOpen = !exportModalOpen">
        <Icon class="text-lg" name="mdi:close" />
      </button>
    </div>
    <input
      class="p-1 text-gray-600 bg-gray-100"
      type="text"
      :value="exportCalendarUrl"
      readonly
    />
    <p>
      Choose the option to
      <i>"import .ical from URL"</i>
      in your calendar program's settings.
    </p>
  </VueFinalModal>
  <div class="p-4">
    <CalendarView
      ref="calendarRef"
      :options="{
        events: getEvents,
        eventClick: handleEventClick,
        customButtons: {
          export: {
            text: 'Export To My Calendar',
            click: () => {
              exportModalOpen = true
            },
          },
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'export',
        },
      }"
    />
  </div>
</template>
