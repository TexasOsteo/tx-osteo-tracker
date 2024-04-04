<script setup lang="ts">
import type { CalendarOptions } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interaction from '@fullcalendar/interaction'

const props = defineProps<{
  options?: CalendarOptions
}>()

// Merge custom options with default options
const options = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, interaction],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev next today',
    center: 'title',
  },
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
  },
  eventColor: 'green',
  ...props.options,
}))

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>()
const calendarApi = computed(() => calendarRef.value?.getApi())

function refetchEvents() {
  calendarApi.value?.refetchEvents()
}

defineExpose({ calendarApi, refetchEvents })
</script>

<template>
  <FullCalendar ref="calendarRef" :options="options" />
</template>
