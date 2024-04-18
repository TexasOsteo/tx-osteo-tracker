<script setup lang="ts">
const { data } = await useFetch('/api/users/me')
const isExpanded1 = ref(false)
const isExpanded2 = ref(false)
const showPopup = ref(false)
const currentEvent = ref(null)
const isSidebar = ref(false)

const toggleSidebar = () => {
  isSidebar.value = !isSidebar.value
}

const togglePresentUpcoming = () => {
  isExpanded1.value = !isExpanded1.value
}

const togglePast = () => {
  isExpanded2.value = !isExpanded2.value
}

const openPopup = (event: any) => {
  currentEvent.value = event
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

function displayDate(dateTime: string) {
  const d = new Date(dateTime)
  const year = d.getUTCFullYear()
  const month = ('0' + (d.getUTCMonth() + 1)).slice(-2)
  const day = ('0' + d.getUTCDate()).slice(-2)

  let hours = d.getUTCHours()
  const minutes = ('0' + d.getUTCMinutes()).slice(-2)
  const ampm = hours >= 12 ? 'pm' : 'am'

  hours = hours % 12
  hours = hours > 0 ? hours : 12 // the hour '0' should be '12'

  return `${year}-${month}-${day} @ ${hours}:${minutes} ${ampm}`
}
</script>

<template>
  <div id="WholePage" class="min-h-screen flex text-center">
    <div
      :class="isSidebar ? 'block md:hidden z-20 fixed' : 'hidden md:block z-0'"
    >
      <UserSideNavbar />
    </div>

    <main
      id="MyEvents"
      class="w-full flex flex-col overflow-auto bg-gray-100 border-2 border-gray-100 border-t-gray-200 border-l-[#EEE]"
    >
      <div id="UFEvents" class="flex-col overflow-y-auto bg-gray-100">
        <div class="fixed bottom-4 right-4">
          <button
            class="w-20 h-20 bg-[#0DA49B] rounded-full flex items-center justify-center text-white block md:hidden"
            @click="toggleSidebar"
            style="font-size: 35px"
          >
            <Icon name="mdi:account" />
          </button>
        </div>
        <div class="z-[0]">
          <button
            class="flex items-center w-full sticky top-0 border-2 border-gray-200 border-t-gray-100 bg-[#FFF] rounded-sm p-2"
            @click="togglePresentUpcoming"
          >
            <h1 class="mr-2">Present & Upcoming Events</h1>
            <img v-if="isExpanded1" src="/icon-park_up.jpg" class="w-5 h-5" />
            <img v-else src="/icon-park_down.jpg" class="w-5 h-5" />
          </button>

          <div
            v-if="isExpanded1 && data"
            class="flex flex-1 items-center justify-center py-3"
          >
            <div
              v-for="(event, index) in data.signedUpEvents"
              :key="index"
              class="bg-white flex items-center p-2 m-2 rounded-xl w-5/6 m:w-full shadow"
            >
              <div class="flex flex-grow">
                <h1 class="mr-4">{{ event.name }}</h1>
                <h1 class="mr-4">{{ displayDate(event.dateAndTime) }}</h1>
              </div>

              <button
                @click="openPopup(event)"
                class="bg-teal-400 hover:bg-teal-500 p-2 rounded-xl text-white"
              >
                View
              </button>
            </div>
          </div>
        </div>

        <div id="PEvents" class="flex-col overflow-y-auto bg-gray-100">
          <button
            class="flex items-center w-full sticky top-0 border-2 border-gray-200 border-t-gray-200 bg-[#FFF] rounded-sm p-2"
            @click="togglePast"
          >
            <h1 class="mr-2">Past Events</h1>
            <img v-if="isExpanded2" src="/icon-park_up.jpg" class="w-5 h-5" />
            <img v-else src="/icon-park_down.jpg" class="w-5 h-5" />
          </button>

          <div
            v-if="isExpanded2 && data"
            class="flex flex-wrap flex-1 items-center justify-center py-3 w-full"
          >
            <div
              v-for="(event, index) in data.eventHistory"
              :key="index"
              class="bg-white flex flex-wrap items-center p-2 m-2 rounded-xl w-full shadow"
            >
              <div class="flex">
                <h1 class="mr-4">{{ event.name }}</h1>
                <h1 class="mr-4">{{ displayDate(event.dateAndTime) }}</h1>
              </div>

              <button
                class="bg-teal-400 hover:bg-teal-500 p-2 rounded-xl"
                @click="openPopup(event)"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showPopup"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 bg-opacity-50"
      >
        <div class="rounded-lg p-1 bg-opacity-100">
          <div class="flex justify-end">
            <button class="bg-[#FF0000]" @click="closePopup">
              <img src="/icon-park_x.jpg" class="w-5 h-5" />
            </button>
          </div>
          <EventListing v-if="currentEvent" :event="currentEvent" />
        </div>
      </div>
    </main>
  </div>
</template>
