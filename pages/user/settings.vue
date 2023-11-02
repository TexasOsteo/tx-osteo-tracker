<script setup lang="ts">
import osteoLogo from '~/components/osteoLogo.vue'
const { data } = await useFetch('/api/auth/me')
const DOB = ref(data.value?.dateOfBirth)
const formattedDOB = DOB.value?.split('T')[0]
const events = await useFetch('/api/events/')
const eventData = events.data
const isExpanded1 = ref(false)
const isExpanded2 = ref(false)
const date = new Date()
const togglePresentUpcoming = () => {
  isExpanded1.value = !isExpanded1.value
}

const togglePast = () => {
  isExpanded2.value = !isExpanded2.value
}
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 grid-flow-row-dense mt-4 ml-4 mr-4"
  >
    <div
      id="ProfilePic"
      class="bg-red-500 items-center justify-center rounded-lg shadow-xl min-h-[50px] row-span-4 hidden sm:block md:block items-center justify-center mx-auto"
    >
      <osteoLogo />
    </div>

    <div
      id="UserInfo"
      class="flex flex-col bg-white rounded-lg shadow-xl min-h-[50px] sm:col-start-1 pl-8 pr-4"
    >
      <p class="mt-3 mb-2 text-gray-700 text-large font-['Work Sans']">
        Total Hours: {{ data?.numHours }}
      </p>
      <p class="mt-3 mb-2 text-gray-700 text-large font-['Work Sans']">
        NAME: {{ data?.name }}
      </p>
      <p class="mb-1 text-gray-700 text-large font-['Work Sans']">
        EMAIL: {{ data?.email }}
      </p>
      <p class="mb-1 text-gray-700 text-large font-['Work Sans']">
        <span class="text-gray-700">Birthday </span>
        <span class="text-gray-400">(YYYY/MM/DD)</span>
        <span class="text-gray-700">: {{ formattedDOB }}</span>
      </p>
      <p class="mt-3 mb-1 text-gray-700 text-large font-['Work Sans']">
        Language(s):
        {{
          data?.languages && data?.languages.length > 0
            ? data?.languages.join(', ')
            : 'None'
        }}
      </p>
      <div class="mb-1 text-gray-700 text-large font-['Work Sans']">
        <p>
          User Notes:
          <span v-if="!(data?.userNotes && data.userNotes.length > 0)"
            >None</span
          >
        </p>
        <ul v-if="data?.userNotes && data.userNotes.length > 0">
          <li v-for="(note, index) in data.userNotes" :key="index" class="ml-5">
            • {{ note }}
          </li>
        </ul>
      </div>

      <div class="mb-3 text-gray-700 text-large font-['Work Sans']">
        <p>
          Qualifications:
          <span v-if="!(data?.qualifications && data.qualifications.length > 0)"
            >None</span
          >
        </p>
        <ul v-if="data?.qualifications && data.qualifications.length > 0">
          <li
            v-for="(qual, index) in data.qualifications"
            :key="index"
            class="ml-5"
          >
            • {{ qual }}
          </li>
        </ul>
      </div>
    </div>

    <div
      id="P&UEvents"
      class="bg-gray-200 rounded-lg shadow-xl min-h-[50px] sm:col-start-2 md:col-span-2"
    >
      <header class="flex items-center mt-3">
        <p class="pl-8 pr-4 text-gray-700 text-large font-['Work Sans']">
          Present & Upcoming Events
        </p>
        <button @click="togglePresentUpcoming">
          <span v-if="isExpanded1">🔼</span>
          <span v-else>🔽<eventList /></span>
        </button>
      </header>
    </div>

    <div
      id="PastEvents"
      class="bg-gray-200 rounded-lg shadow-xl min-h-[50px] sm:col-start-2 md:col-span-2"
    >
      <header class="flex items-center mt-3">
        <p class="pl-8 pr-4 text-gray-700 text-large font-['Work Sans']">
          Past Events
        </p>
        <button @click="togglePast">
          <span v-if="isExpanded2">🔼</span>
          <span v-else
            >🔽
            <EventListing
              v-for="event in eventData?.filter(
                (ev) => new Date(ev.dateAndTime) > date,
              )"
              :key="event.id"
              :event="event"
            ></EventListing>
          </span>
        </button>
      </header>
    </div>

    <div
      id="AccountInteraction"
      class="flex flex-col items-center bg-white rounded-lg shadow-xl min-h-[50px] sm:col-start-1"
    >
      <!-- font-light makes the font malnourished-->
      <button
        class="rounded-lg bg-teal-500 w-1/2 p-1.5 mt-4 mb-4 text-white text-large font-['Work Sans'] hover:bg-teal-600"
      >
        Sign Out
      </button>
      <button
        class="rounded-lg bg-yellow-500 w-1/2 p-1.5 mb-4 text-white text-large font-['Work Sans'] hover:bg-yellow-600"
      >
        Edit Account
      </button>
      <button
        class="rounded-lg bg-red-500 w-1/2 p-1.5 mb-4 text-white text-large font-['Work Sans'] hover:bg-red-600"
      >
        Delete Account
      </button>
    </div>
  </div>
</template>
