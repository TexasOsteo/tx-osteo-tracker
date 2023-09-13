<script setup lang="ts">
const { data } = await useFetch('/api/events')
</script>

<template>
  <CalciumCorpsLogo class="w-full" />
  <ul v-if="data !== null">
    <li v-for="(event, id) in data" :key="id">
      <NuxtLink :to="'/events/' + id" class="underline">
        <b>{{ event.name }}</b> - {{ event.location }}
      </NuxtLink>
    </li>
  </ul>
</template>
