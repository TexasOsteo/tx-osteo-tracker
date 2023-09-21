<script setup lang="ts">
const { data } = await useFetch('/api/events')
</script>

<template>
  <CalciumCorpsLogo class="w-full" />
  <ul v-if="data !== null">
    <li v-for="event in data" :key="event.id">
      <NuxtLink :to="'/event/' + event.id" class="underline">
        <b>{{ event.name }}</b> - {{ event.location }}
      </NuxtLink>
    </li>
  </ul>
</template>
