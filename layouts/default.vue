<script setup lang="ts">
const isAdmin = isSignedInUserAdmin()
</script>

<template>
  <div>
    <div
      class="h-20 w-full bg-white flex items-center justify-between shadow z-10 px-4"
    >
      <div class="h-full flex items-center">
        <h1 class="text-xl hidden sm:block">TEXAS OSTEOPOROSIS FOUNDATION</h1>
        <h1 class="text-3xl block sm:hidden">TOF</h1>
      </div>
      <div class="h-full w-auto flex items-center gap-8 text-xl">
        <NuxtLink to="/event/calendar">Calendar</NuxtLink>
        <NuxtLink to="/event/listings">Events</NuxtLink>
        <NuxtLink v-if="isAdmin" to="/event/new">+</NuxtLink>
        <div class="h-full p-2 aspect-square">
          <NuxtLink to="/users/me">
            <ProfileAvatar />
          </NuxtLink>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
