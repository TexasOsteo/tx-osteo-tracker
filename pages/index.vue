<script setup lang="ts">
// useFetch will request the data as the server and forward it to the client
// data will contain the event or null if there was an error
const { data } = await useFetch('/api/events')
</script>

<template>
  <CalciumCorpsLogo class="w-full" />
  <!-- Do not render the list if no events were found -->
  <ul v-if="data !== null">
    <!-- v-for will iterate through the event list and create an <li> element for each -->
    <!-- :key="event.id" makes sure vue knows which <li> element corresponds to which event -->
    <li v-for="event in data" :key="event.id">
      <!-- NuxtLinks are just like <a> tags but more optimized for nuxt -->
      <!-- adding ':' in front of to lets us use typescript inside the quotes -->
      <NuxtLink :to="'/event/' + event.id" class="underline">
        <b>{{ event.name }}</b> - {{ event.location }}
      </NuxtLink>
    </li>
  </ul>
</template>
