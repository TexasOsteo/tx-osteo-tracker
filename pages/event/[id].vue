<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch(`/api/event/${route.params.id}`)
</script>

<template>
  <h1 v-if="data === null">Error: No Data!</h1>
  <div v-if="data !== null">
    <h1>
      <b>{{ data.name }}</b>
    </h1>
    <p>{{ data.location }}</p>
    <NuxtLink to="/" class="underline">Home</NuxtLink>
  </div>
</template>
