<script setup lang="ts">
import ISO6391 from 'iso-639-1'

import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interaction from '@fullcalendar/interaction'
import type { CalendarOptions } from '@fullcalendar/core'
import EventModal from './EventModal.vue'

/*
  TODO: Make events dynamically request from the database when a new month is chosen.
  Right now it gets every event from the database which isn't scalable.

  Also, replace the dialog box with a modal
*/
const eventFilter = ref({
  selectedLocation: 'all',
  selectedOrganization: 'all',
  selectedTime: '',
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
  const location = eventFilter.value.selectedLocation
  const organization = eventFilter.value.selectedOrganization
  const selectedTimeDate = eventFilter.value.selectedTime
    ? new Date(eventFilter.value.selectedTime)
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
      } else if (
        // organization filter
        location === 'all' &&
        organization !== 'all' &&
        !selectedTimeDate
      ) {
        return event.extendedProps.organization === organization
      } else if (
        // location filter
        location !== 'all' &&
        organization === 'all' &&
        !selectedTimeDate
      ) {
        return event.extendedProps.location === location
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
    <h1 class="title font-sans font-bold text-5xl text-center pt-10">Sign Up</h1>
    <div class="flex flex-wrap items-center justify-center">
      <table class="table-fixed border-separate border-spacing-10">
        <tr class="text-center place-content-strech self-auto">
          <th>
            <!--Filter events by Location-->
            <label
              class="block font-bold text-center text-black"
              for="locationFilter"
              >Location</label
            >
            <div class="bg-slate-200 p-2 m-2 rounded-lg">
              <select
                id="locationFilter"
                v-model="eventFilter.selectedLocation"
                class="text-center bg-slate-200"
                @change="filterEvents"
              >
                <option value="all">All</option>
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>
          </th>
          <th>
            <!--Filter events by Organization-->
            <label
              class="block font-bold text-center text-black"
              for="organizationFilter"
              >Organization</label
            >
            <div class="bg-slate-200 p-2 m-2 rounded-lg">
              <select
                id="organizationFilter"
                v-model="eventFilter.selectedOrganization"
                class="text-center bg-slate-200"
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
            </div>
          </th>
          <th>
            <!--Filter events by Date and Time-->
            <label
              class="block font-bold text-center text-black"
              for="timeFilter"
              >Time</label
            >
            <div class="bg-slate-200 p-2 m-2 rounded-lg">
              <input
                id="timeFilter"
                v-model="eventFilter.selectedTime"
                type="datetime-local"
                class="text-center bg-slate-200"
                @change="filterEvents"
              />
            </div>
          </th>
        </tr>
      </table>
    </div>
    <FullCalendar ref="calendar" :options="calendarOptions" />
  </div>
  <div>
    <EventModal
      :id="modalEvent.id"
      :modal-active="modalActive"
      @close-modal="toggleModal"
    >
      <!--Modal Header -->
      <div
        class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 pt-20"
      >
        <h2
          id="modalTitle"
          class="text-5xl font-sans font-bold text-cyan-950 uppercase"
        >
          {{ modalEvent.title }}
        </h2>
      </div>
      <!-- Modal body -->

      <div class="p-6 space-y-5">
        <div class="flex flex-wrap bg-slate-200 px-5 rounded-lg pb-5">
          <ul class="w-full mb-5 block sm:w-1/2">
            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.7549 13.9999C18.0502 14 18.3427 14.0583 18.6155 14.1715C18.8883 14.2846 19.1362 14.4504 19.3449 14.6593C19.5536 14.8682 19.7192 15.1162 19.8321 15.3892C19.945 15.6621 20.003 15.9545 20.0029 16.2499V17.1679C20.0029 17.7409 19.8239 18.2996 19.4909 18.7659C17.9449 20.9299 15.4209 22.0009 12.0009 22.0009C8.57891 22.0009 6.05591 20.9289 4.51391 18.7649C4.18203 18.2989 4.00376 17.741 4.00391 17.1689V16.2489C4.00391 15.6524 4.24085 15.0804 4.66262 14.6586C5.08439 14.2368 5.65643 13.9999 6.25291 13.9999H17.7549ZM11.9999 2.00488C12.6565 2.00488 13.3067 2.13421 13.9133 2.38548C14.52 2.63676 15.0711 3.00506 15.5354 3.46935C15.9997 3.93364 16.368 4.48484 16.6193 5.09147C16.8706 5.69809 16.9999 6.34827 16.9999 7.00488C16.9999 7.66149 16.8706 8.31167 16.6193 8.9183C16.368 9.52493 15.9997 10.0761 15.5354 10.5404C15.0711 11.0047 14.52 11.373 13.9133 11.6243C13.3067 11.8756 12.6565 12.0049 11.9999 12.0049C10.6738 12.0049 9.40205 11.4781 8.46437 10.5404C7.52669 9.60273 6.99991 8.33097 6.99991 7.00488C6.99991 5.6788 7.52669 4.40703 8.46437 3.46935C9.40205 2.53167 10.6738 2.00488 11.9999 2.00488Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <h3 class="mr-20 ml-3">{{ modalEvent.organization }}</h3>
              </div>
            </li>
            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.157 16.8821L16.97 18.0561C16.095 18.9141 14.96 20.0181 13.564 21.3681C13.1444 21.7738 12.5836 22.0006 12 22.0006C11.4163 22.0006 10.8555 21.7738 10.436 21.3681L6.94497 17.9721C6.50497 17.5411 6.13897 17.1781 5.84297 16.8821C4.62534 15.6644 3.79614 14.113 3.46023 12.424C3.12432 10.735 3.29678 8.98435 3.95581 7.39339C4.61484 5.80243 5.73084 4.44261 7.16269 3.48591C8.59453 2.5292 10.2779 2.01855 12 2.01855C13.722 2.01855 15.4054 2.5292 16.8373 3.48591C18.2691 4.44261 19.3851 5.80243 20.0441 7.39339C20.7032 8.98435 20.8756 10.735 20.5397 12.424C20.2038 14.113 19.3746 15.6644 18.157 16.8821ZM14.5 11.0001C14.5 10.3371 14.2366 9.70119 13.7677 9.23235C13.2989 8.7635 12.663 8.50011 12 8.50011C11.3369 8.50011 10.701 8.7635 10.2322 9.23235C9.76336 9.70119 9.49997 10.3371 9.49997 11.0001C9.49997 11.6632 9.76336 12.299 10.2322 12.7679C10.701 13.2367 11.3369 13.5001 12 13.5001C12.663 13.5001 13.2989 13.2367 13.7677 12.7679C14.2366 12.299 14.5 11.6632 14.5 11.0001Z"
                      fill="black"
                    />
                  </svg>
                </div>

                <h3 class="mr-20 ml-3">
                  <event class="location">{{ modalEvent.location }}</event>
                </h3>
              </div>
            </li>
            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 10H7V12H9V10ZM13 10H11V12H13V10ZM17 10H15V12H17V10ZM19 3H18V1H16V3H8V1H6V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3ZM19 19H5V8H19V19Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <h3 class="mr-20 ml-3">
                  {{ modalEvent.date }}
                </h3>
              </div>
            </li>
            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 20V18H2V15C2 13.9833 2.23767 13.029 2.713 12.137C3.18833 11.245 3.85067 10.5327 4.7 10C3.85 9.46667 3.18767 8.754 2.713 7.862C2.23833 6.97 2.00067 6.016 2 5V2H0V0H16V2H14V5C14 6.01667 13.7623 6.971 13.287 7.863C12.8117 8.755 12.1493 9.46733 11.3 10C12.15 10.5333 12.8127 11.246 13.288 12.138C13.7633 13.03 14.0007 13.984 14 15V18H16V20H0Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <h3 class="mr-20 ml-3">
                  {{ modalEvent.duration }}
                </h3>
              </div>
            </li>
            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 8L11 14M4 14L10 8L12 5M2 5H14M7 2H8M22 22L17 12L12 22M14 18H20"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <h3>
                  <span
                    v-for="(language, index) in modalEvent.languages"
                    :key="index"
                    class="font-sans text-cyan-950"
                  >
                    <span v-if="index !== 0">, </span>{{ language }}
                  </span>
                </h3>
              </div>
            </li>
          </ul>
          <ul class="w-full mb-5 block sm:w-1/2">
            <li>
              <div class="flex items-center mt-5">
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 20V18H2V15C2 13.9833 2.23767 13.029 2.713 12.137C3.18833 11.245 3.85067 10.5327 4.7 10C3.85 9.46667 3.18767 8.754 2.713 7.862C2.23833 6.97 2.00067 6.016 2 5V2H0V0H16V2H14V5C14 6.01667 13.7623 6.971 13.287 7.863C12.8117 8.755 12.1493 9.46733 11.3 10C12.15 10.5333 12.8127 11.246 13.288 12.138C13.7633 13.03 14.0007 13.984 14 15V18H16V20H0Z"
                    fill="black"
                  />
                </svg>
                <h3 class="ml-3">{{ modalEvent.hoursOffered }} Hours Given</h3>
              </div>
            </li>
            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 2.01294H9V8.99994H2V14.9999H9V21.9869H15V14.9999H22V8.99994H15V2.01294Z"
                      fill="black"
                    />
                  </svg>
                </div>

                <span
                  v-for="(prerequisite, index) in modalEvent.prerequisites"
                  :key="index"
                  class="font-sans text-cyan-950"
                >
                  <span v-if="index !== 0">, </span>{{ prerequisite }}</span
                >
              </div>
            </li>

            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 2.01294H9V8.99994H2V14.9999H9V21.9869H15V14.9999H22V8.99994H15V2.01294Z"
                      fill="black"
                    />
                  </svg>
                </div>

                <span
                  v-for="(position, index) in modalEvent.volunteerPositions"
                  :key="index"
                  class="font-sans text-cyan-950"
                >
                  <span v-if="index !== 0">, </span>{{ position }}</span
                >
              </div>
            </li>

            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.552 22.133C15.112 22.08 11.031 21.516 6.757 17.243C2.484 12.969 1.921 8.88897 1.867 7.44797C1.787 5.25197 3.469 3.11897 5.412 2.28597C5.64598 2.18494 5.9022 2.14647 6.15553 2.17435C6.40886 2.20222 6.65059 2.29548 6.857 2.44497C8.457 3.61097 9.561 5.37497 10.509 6.76197C10.7176 7.0667 10.8068 7.43752 10.7596 7.80377C10.7123 8.17002 10.532 8.5061 10.253 8.74797L8.302 10.197C8.20774 10.265 8.14139 10.365 8.11528 10.4783C8.08916 10.5916 8.10505 10.7105 8.16 10.813C8.602 11.616 9.388 12.812 10.288 13.712C11.189 14.612 12.441 15.45 13.3 15.942C13.4077 16.0024 13.5345 16.0193 13.6543 15.9892C13.774 15.9591 13.8777 15.8842 13.944 15.78L15.214 13.847C15.4475 13.5368 15.7919 13.329 16.1752 13.2672C16.5584 13.2053 16.9508 13.2941 17.27 13.515C18.677 14.489 20.319 15.574 21.521 17.113C21.6826 17.3209 21.7854 17.5684 21.8187 17.8296C21.8519 18.0908 21.8144 18.3562 21.71 18.598C20.873 20.551 18.755 22.214 16.552 22.133Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <h3 class="mr-20 ml-3">{{ modalEvent.phoneNumber }}</h3>
              </div>
            </li>
            <li>
              <div class="flex items-center mt-5">
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <h3 class="mr-20 ml-3">{{ modalEvent.email }}</h3>
              </div>
            </li>
            <div class="flex flex-wrap items-center">
              <h3
                class="mr-20 mt-3 text-xl font-medium"
                :class="{
                  'text-yellow-500':
                    parseInt(modalEvent.capacity) >= 5 &&
                    parseInt(modalEvent.capacity) <= 10,
                  'text-red-500': parseInt(modalEvent.capacity) < 5,
                  'text-green-500': parseInt(modalEvent.capacity) >= 10,
                }"
              >
                {{ modalEvent.capacity }} SLOTS LEFT
              </h3>
            </div>
          </ul>

          <p class="text-base leading-relaxed text-cyan-900">
            Description:
            <span id="modalDescription" class="font-sans text-cyan-950">{{
              modalEvent.description
            }}</span>
          </p>
        </div>

        <div class="">
          <p class="text-base leading-relaxed text-cyan-900">
            <img :src="modalEvent.thumbnail" />
          </p>
        </div>
      </div>
    </EventModal>
  </div>
</template>
