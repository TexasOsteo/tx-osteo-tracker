<script setup lang="ts">
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interaction from '@fullcalendar/interaction'
import { CalendarOptions } from '@fullcalendar/core'

/*
  TODO: Make events dynamically request from the database when a new month is chosen.
  Right now it gets every event from the database which isn't scalable.

  Also, replace the dialog box with a modal.
*/

const selectedLocation = ref('all') // initial selected location
const selectedOrganization = ref('all') // initial selected organization
const cities = ref<Array<string>>([])
const organizations = ref<Array<string>>([])
const selectedTime = ref('') // initial selected time

// list of events
const eventsData = ref<
  Array<{ title: string; start: Date; extendedProps: any }>
>([])

// calendar and events display
const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, interaction],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev next today',
    center: 'title',
  },
  events: ref<Array<{ title: string; start: Date; extendedProps: any }>>([]),
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
  },
  eventClick: (info: any) => {
    alert(
      'Organization: ' +
        info.event.extendedProps.organization +
        '\nLocation: ' +
        info.event.extendedProps.location,
    )
  },
  eventColor: 'green',
} as CalendarOptions)

// fetch data from api
const fetchEvents = async () => {
  const { data, error } = await useFetch('/api/events')
  const events = data.value
  if (events != null) {
    const calendar = events.map((event) => ({
      title: event.name,
      start: new Date(event.dateAndTime),
      extendedProps: {
        organization: event.organizer,
        location: event.location,
      },
    }))
    cities.value = Array.from(new Set(events.map((event) => event.location)))
    organizations.value = Array.from(
      new Set(events.map((event) => event.organizer)),
    )
    calendarOptions.value.events = calendar // return data for calendar component
    eventsData.value = calendar // data for event filter
  } else {
    console.error('Failed to fetch events data:', error.value)
  }
}

// event filter
const filterEvents = () => {
  const location = selectedLocation.value
  const organization = selectedOrganization.value
  const selectedTimeDate = selectedTime.value
    ? new Date(selectedTime.value)
    : null

  if (location === 'all' && organization === 'all' && !selectedTimeDate) {
    // show all events
    calendarOptions.value.events = eventsData.value
  } else {
    // Filter events by the selected location, time, and organization
    calendarOptions.value.events = eventsData.value.filter((event) => {
      if (location === 'all' && organization === 'all' && selectedTimeDate) {
        // timefilter
        return new Date(event.start) >= selectedTimeDate
      } else if (
        // location and date time filter
        location !== 'all' &&
        organization === 'all' &&
        selectedTimeDate
      ) {
        return (
          event.extendedProps.location === location &&
          new Date(event.start) >= selectedTimeDate
        )
      } else if (
        // organization and date time filter
        location === 'all' &&
        organization !== 'all' &&
        selectedTimeDate
      ) {
        return (
          event.extendedProps.organization === organization &&
          new Date(event.start) >= selectedTimeDate
        )
      } else {
        return (
          // location or organization filter
          event.extendedProps.location === location ||
          event.extendedProps.organization === organization
        )
      }
    })
  }
}
fetchEvents()
</script>

<template>
  <div>
    <table class="table-fixed border-separate border-spacing-10">
      <tr class="text-center place-content-strech self-auto">
        <th>
          <label
            class="block font-bold text-center text-blue-900"
            for="locationFilter"
            >Location</label
          >
          <select
            id="locationFilter"
            v-model="selectedLocation"
            class="text-center"
            @change="filterEvents"
          >
            <option value="all">All</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </th>
        <th>
          <label
            class="block font-bold text-center text-blue-900"
            for="organizationFilter"
            >Organization</label
          >
          <select
            id="organizationFilter"
            v-model="selectedOrganization"
            class="text-center"
            @change="filterEvents"
          >
            <option value="all">All</option>
            <option
              v-for="organization in organizations"
              :key="organization"
              :value="organization"
            >
              {{ organization }}
            </option>
          </select>
        </th>
        <th>
          <label
            class="block font-bold text-center text-blue-900"
            for="timeFilter"
            >Time</label
          >
          <input
            id="timeFilter"
            v-model="selectedTime"
            type="datetime-local"
            class="text-center"
            @change="filterEvents"
          />
        </th>
      </tr>
    </table>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
