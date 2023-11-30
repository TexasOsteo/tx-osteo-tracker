<script setup lang="ts">
import { ref } from 'vue'
import ISO6391 from 'iso-639-1'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interaction from '@fullcalendar/interaction'
import { CalendarOptions } from '@fullcalendar/core'
import EventModal from './EventModal.vue'

/*
  TODO: Make events dynamically request from the database when a new month is chosen.
  Right now it gets every event from the database which isn't scalable.

  Also, replace the dialog box with a modal
*/
const eventFilter = ref({
  selectedLocation: 'all',
  selectedOrganization: 'all',
  selectedDate: '',
})
const cities = ref<Array<string>>([])
const organizations = ref<Array<string>>([])

const modalActive = ref(false)
const toggleModal = () => {
  modalActive.value = !modalActive.value
}

const modalEvent = ref({
  id: '',
  title: '',
  date: '',
  organization: '',
  location: '',
  duration: '',
  languages: '',
  thumbnail: '',
  hoursOffered: '',
  prerequisites: '',
  volunteerPositions: '',
  phoneNumber: '',
  email: '',
  capacity: '',
  description: '',
})

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
    modalEvent.value.id = info.event.extendedProps.id
    modalEvent.value.title = info.event.title
    modalEvent.value.date = info.event.start
    modalEvent.value.location = info.event.extendedProps.location
    modalEvent.value.organization = info.event.extendedProps.organization
    modalEvent.value.description = info.event.extendedProps.description
    modalEvent.value.duration = info.event.extendedProps.duration
    modalEvent.value.languages = info.event.extendedProps.languages
    modalEvent.value.thumbnail = info.event.extendedProps.thumbnail
    modalEvent.value.hoursOffered = info.event.extendedProps.hoursOffered
    modalEvent.value.prerequisites = info.event.extendedProps.prerequisites
    modalEvent.value.volunteerPositions =
      info.event.extendedProps.volunteerPositions
    modalEvent.value.phoneNumber = info.event.extendedProps.phoneNumber
    modalEvent.value.email = info.event.extendedProps.email
    modalEvent.value.capacity = info.event.extendedProps.capacity
    modalActive.value = true
  },
  eventColor: 'green',
} as CalendarOptions)

// fetch data from api
const fetchEvents = async () => {
  const { data, error } = await useFetch(`/api/events`)
  const events = data.value
  if (events != null) {
    const calendar = events.map((event) => ({
      title: event.name,
      start: new Date(event.dateAndTime),
      extendedProps: {
        organization: event.organizer,
        location: event.location,
        description: event.description,
        duration: event.duration,
        languages: event.languages,
        thumbnail: event.thumbnail,
        hoursOffered: event.hoursOffered,
        prerequisites: event.prerequisites,
        volunteerPositions: event.volunteerPositions,
        phoneNumber: event.phoneNumber,
        capacity: event.capacity,
        id: event.id,
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
  const locationFilter = eventFilter.value.selectedLocation
  const organizationFilter = eventFilter.value.selectedOrganization
  const dateFilter = eventFilter.value.selectedDate
    ? new Date(eventFilter.value.selectedDate)
    : null
  if (locationFilter === 'all' && organizationFilter === 'all' && !dateFilter) {
    // show all events
    calendarOptions.value.events = eventsData.value
  } else {
    // Filter events by the selected location, time, and organization
    calendarOptions.value.events = eventsData.value.filter((event) => {
      if (locationFilter === 'all' && organizationFilter === 'all' && dateFilter) {
        // timefilter
        return new Date(event.start) >= dateFilter
      } else if (
        // location and date time filter
        locationFilter !== 'all' &&
        organizationFilter === 'all' &&
        dateFilter
      ) {
        return (
          event.extendedProps.location === location &&
          new Date(event.start) >= dateFilter
        )
      } else if (
        // organization and date time filter
        locationFilter === 'all' &&
        organizationFilter !== 'all' &&
        dateFilter
      ) {
        return (
          event.extendedProps.organization === organizationFilter &&
          new Date(event.start) >= dateFilter
        )
      } else if (
        // organization filter
        locationFilter === 'all' &&
        organizationFilter !== 'all' &&
        !dateFilter
      ) {
        return event.extendedProps.organization === organizationFilter
      } else if (
        // location filter
        locationFilter !== 'all' &&
        organizationFilter === 'all' &&
        !dateFilter
      ) {
        return event.extendedProps.location === locationFilter
      } else {
        return (
          // location or organization filter
          event.extendedProps.location === locationFilter ||
          event.extendedProps.organization === organizationFilter
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
          <!--Filter events by Location-->
          <label class="block font-bold text-center text-blue-900" for="locationFilter">Location</label>
          <select id="locationFilter" v-model="eventFilter.selectedLocation" class="text-center" @change="filterEvents">
            <option value="all">All</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </th>
        <th>
          <!--Filter events by Organization-->
          <label class="block font-bold text-center text-blue-900" for="organizationFilter">Organization</label>
          <select id="organizationFilter" v-model="eventFilter.selectedOrganization" class="text-center"
            @change="filterEvents">
            <option value="all">All</option>
            <option v-for="organization in organizations" :key="organization" :value="organization">
              {{ organization }}
            </option>
          </select>
        </th>
        <th>
          <!--Filter events by Date-->
          <label class="block font-bold text-center text-blue-900" for="timeFilter">Date</label>
          <input id="timeFilter" v-model="eventFilter.selectedDate" type="date" class="text-center"
            @change="filterEvents" />
        </th>
      </tr>
    </table>
    <FullCalendar ref="calendar" :options="calendarOptions" />
  </div>
  <div>
    <EventModal :id="modalEvent.id" :modal-active="modalActive" @close-modal="toggleModal">
      <!--Modal Header -->
      <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
        <h2 id="modalTitle" class="text-2xl font-sans text-cyan-950 uppercase">
          {{ modalEvent.title }}
        </h2>
      </div>
      <!-- Modal body -->
      <div class="p-6 space-y-5">
        <p class="text-base leading-relaxed text-cyan-900">
          Organization:
          <span id="modalOrganization" class="font-sans text-cyan-950">{{
            modalEvent.organization
          }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Location:
          <span id="modalLocation" class="font-sans text-cyan-950">{{
            modalEvent.location
          }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Date:
          <span id="modalDate" class="font-sans text-cyan-950">{{
            new Date(modalEvent.date).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Duration:
          <span id="modalDate" class="font-sans text-cyan-950">{{
            modalEvent.duration
          }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Languages:
          <span v-for="(language, index) in modalEvent.languages" :key="language" class="font-sans text-cyan-950">
            <span v-if="index !== 0">, </span>{{ ISO6391.getName(language) }}
          </span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Thumbnail:
          <img :src="modalEvent.thumbnail" />
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Service Hours Offered:
          <span id="modalDate" class="font-sans text-cyan-950">{{
            modalEvent.hoursOffered
          }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Prerequisites:
          <span v-for="(prerequisite, index) in modalEvent.prerequisites" :key="index" class="font-sans text-cyan-950">
            <span v-if="index !== 0">, </span>{{ prerequisite }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Volunteer Positions:
          <span v-for="(position, index) in modalEvent.volunteerPositions" :key="index" class="font-sans text-cyan-950">
            <span v-if="index !== 0">, </span>{{ position }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Phone Number:
          <span id="modalDate" class="font-sans text-cyan-950">{{
            modalEvent.phoneNumber
          }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Email:
          <span id="modalDate" class="font-sans text-cyan-950">{{
            modalEvent.email
          }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Capacity:
          <span id="modalDate" class="font-sans text-cyan-950">{{
            modalEvent.capacity
          }}</span>
        </p>
        <p class="text-base leading-relaxed text-cyan-900">
          Description:
          <span id="modalDescription" class="font-sans text-cyan-950">{{
            modalEvent.description
          }}</span>
        </p>
      </div>
    </EventModal>
  </div>
</template>
