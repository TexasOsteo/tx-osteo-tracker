<script lang="ts">


// Fetch API call
const { events } = await useFetch('/api/events/')
const eventData = events.data

// Import Prisma client
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()

</script>
<!--Copy paste from Sai's code-->
<template>
<div v-if="event.id != null">
    <h1 v-for="event in eventData" :key="event.id">
      {{ !event.isSignUpAvailable }}
    </h1>
  </div>

</template>

