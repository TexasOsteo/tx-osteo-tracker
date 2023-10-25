<script setup lang="ts">
// Fetch API call by destructing the events response object into its data
const { data: events } = await useFetch(`/api/events?after=${Date.now()}`)
</script>
<template>
  <ul>
    <li v-for="event in events" :key="event.id">
      <EventListing :event="event"> </EventListing>
    </li>
  </ul>
</template>
