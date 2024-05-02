<script setup lang="ts">
const { data } = await useFetch('/api/users/me')
const isExpanded1 = ref(false)
const isExpanded2 = ref(false)
const showPopup = ref(false)
const currentEvent = ref(null)
const isSidebar = ref(false)
const showCustomPopup = ref(false)

const openCustomPopup = () => {
  showCustomPopup.value = true
}

const closeCustomPopup = () => {
  showCustomPopup.value = false
}

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
  console.log('Opening popup for event:', event) // Debug: Check what event is being passed
  currentEvent.value = event
  showPopup.value = true
}

const closePopup = () => {
  console.log('Closing popup.') // Debug: Confirm this is being called
  showPopup.value = false
}

const futureEvents = computed(() => {
  const now = new Date()
  return (
    data.value?.signedUpEvents?.filter(
      (event) => new Date(event.dateAndTime) > now,
    ) || []
  )
})

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
      :class="isSidebar ? 'block md:hidden z-10 fixed' : 'hidden md:block z-0'"
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
        <div class="">
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
            class="flex flex-wrap items-center justify-center py-3"
          >
            <div
              v-for="(event, index) in futureEvents"
              :key="index"
              class="bg-white flex items-center p-2 m-2 rounded-xl w-full shadow"
            >
              <div class="flex flex-grow">
                <h1 class="mr-4">{{ event.name }}</h1>
                <h1 class="mr-4">{{ displayDate(event.dateAndTime) }}</h1>
              </div>

              <button
                class="bg-teal-600 hover:bg-teal-500 p-2 rounded-md md:rounded-xl text-white"
                @click="openPopup(event)"
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
            class="flex flex-wrap items-center justify-center py-3 w-full"
          >
            <div
              v-for="(event, index) in data.eventHistory"
              :key="index"
              class="bg-white flex items-center p-2 m-2 rounded-xl w-full shadow"
            >
              <div class="flex flex-grow">
                <h1 class="mr-4">{{ event.name }}</h1>
                <h1 class="mr-4">{{ displayDate(event.dateAndTime) }}</h1>
              </div>

              <button
                class="flex items-center bg-teal-600 hover:bg-teal-500 p-2 rounded-md md:rounded-xl text-white"
                @click="openPopup(event)"
              >
                View
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="showPopup"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div class="rounded-lg p-1 bg-opacity-100 w-full">
            <div class="flex justify-end pr-10 pb-10">
              <button
                class="bg-red-600 hover:bg-red-500 rounded-full w-10 h-10 pb-1"
                @click="closePopup"
              >
                <Icon name="mdi:close" class="text-white" />
              </button>
            </div>
            <EventListing
              v-if="currentEvent"
              id="EventScroll"
              class="hidden sm:block overflow-auto"
              :event="currentEvent"
            />
            <EventListingMobile
              v-if="currentEvent"
              id="EventScroll"
              class="block sm:hidden my-5 overflow-auto"
              :event="currentEvent"
            ></EventListingMobile>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
#EventScroll {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
