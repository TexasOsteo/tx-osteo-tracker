<script setup lang="ts">
const auth0Cookie = useCookie(useRuntimeConfig().public.auth0_token)
const volunteerCookie = useCookie(useRuntimeConfig().public.txosteo_token)
</script>

<template>
  <h1 class="mb-5">
    This is the landing page for all users (unauthenticated and authenticated)
  </h1>
  <div v-if="auth0Cookie">
    You are authenticated!
    <a href="/api/auth/logout" class="text-blue-500 p-1 underline">Logout</a>
  </div>
  <div v-if="!auth0Cookie">
    You are not authenticated
    <a href="/api/auth/login" class="text-blue-500 p-1 underline">Login</a>
  </div>
  <a href="/eventList">Event Listings</a>
  <p v-if="volunteerCookie">You have an account in the system!</p>
  <p v-if="!volunteerCookie">You have do not have an account in the system</p>

  <NuxtLink>
    <a href="/event/new" class="text-blue-500 p-1 underline"
      >Event Creation Page</a
    >
  </NuxtLink>
</template>
