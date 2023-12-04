<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'

const isAdmin = isSignedInUserAdmin()

const menuItemClass =
  'bg-gray-100 hover:bg-gray-200 p-3 rounded-md flex items-center gap-2 drop-shadow-sm'
</script>

<template>
  <div>
    <div
      class="fixed top-0 h-20 w-full max-w-full bg-white flex items-center justify-between shadow z-40 px-4"
    >
      <div class="h-full flex items-center">
        <h1 class="text-xl hidden sm:block">TEXAS OSTEOPOROSIS FOUNDATION</h1>
      </div>
      <div
        class="h-full w-full sm:w-auto justify-between flex items-center sm:gap-8 gap-2 text-xl"
      >
        <NuxtLink :class="menuItemClass" to="/event/calendar">
          <Icon name="mdi:calendar" />
          <span class="hidden sm:block">Calendar</span>
        </NuxtLink>
        <NuxtLink :class="menuItemClass" to="/event/listings">
          <Icon class="sm:block" name="mdi:list-box-outline" />
          <span class="hidden sm:block">Events</span>
        </NuxtLink>
        <NuxtLink v-if="isAdmin" :class="menuItemClass" to="/event/new">
          <Icon class="sm:block" name="mdi:calendar-plus" />
          <span class="hidden sm:block">New Event</span>
        </NuxtLink>
        <a :class="menuItemClass" href="/api/auth/logout">
          <Icon class="sm:block" name="mdi:logout-variant" />
          <span class="hidden sm:block">Log Out</span>
        </a>
        <div class="h-full p-2 aspect-square">
          <NuxtLink to="/users/me/settings">
            <ProfileAvatar class="w-full h-full rounded-full drop-shadow-sm" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="mt-20 w-full">
      <slot />
    </div>
    <ModalsContainer />
  </div>
</template>
