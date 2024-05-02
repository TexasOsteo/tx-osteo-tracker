<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const { data: eventInfo } = await useFetch(`/api/events/${id}`)
</script>

<template>
  <div class="py-20 flex justify-center flex-wrap items-center">
    <CurveBackground />

    <div
      v-if="!eventInfo"
      class="w-11/12 bg-white bg-opacity-95 md:bg-opacity-80 backdrop-blur-none md:backdrop-blur-md z-0 rounded-3xl shadow-2xl p-10 flex justify-center flex-wrap items-center mx-2"
    >
      <h1 class="font-bold text-3xl text-red-500">Failed to load event info</h1>
    </div>

    <div
      v-if="eventInfo"
      class="w-11/12 bg-white bg-opacity-95 md:bg-opacity-80 backdrop-blur-none md:backdrop-blur-md z-0 rounded-3xl shadow-2xl p-10 flex justify-center flex-wrap items-center mx-2"
    >
      <AttendeeList :event-id="id" :users="eventInfo.attendees" />
      <SignedUpList
        :event-id="id"
        :users="eventInfo.signedUpUsers"
        :positions="eventInfo.positions"
      />
    </div>
  </div>
</template>
