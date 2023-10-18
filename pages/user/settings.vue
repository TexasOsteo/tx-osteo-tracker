<script setup lang="ts">
const { data } = await useFetch('/api/auth/me')
const events = await useFetch('/api/events/')
const eventData = events.data
</script>

<template>
<<<<<<< Updated upstream
=======
  <div class="w-[426px] h-[1219px] relative"></div>
  <div class="w-[426px] h-[1219px] left-0 top-0 absolute bg-white"></div>
  <div class="w-[426px] h-[1219px] left-0 top-0 absolute bg-white"></div>
  <div class="w-[352.90px] h-[834.76px] left-[37px] top-[62px] absolute"></div>
>>>>>>> Stashed changes
  <h1><u>Account Information</u></h1>
  <h3>{{ data?.email }}</h3>
  <h3>{{ data?.name }}</h3>
  <h3>{{ data?.age }}</h3>
  <h3>{{ data?.userNotes }}</h3>
  <h3>{{ data?.qualifications }}</h3>
  <h1><u>Upcoming Events</u></h1>
  <div v-if="eventData != null">
    <h1 v-for="event in eventData" :key="event.id">{{ event.name }}</h1>
  </div>
  <h1><u>Past Events</u></h1>
  <div v-if="eventData != null">
    <h1 v-for="event in eventData" :key="event.id">
      {{ !event.isSignUpAvailable }}
    </h1>
  </div>
</template>
