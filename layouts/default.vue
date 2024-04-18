<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'

const isAdmin = isSignedInUserAdmin()
const isMenuOpen = ref(false)

useSeoMeta({
  title: 'Texas Osteoperosis Foundation Volunteering',
  ogTitle: 'Texas Osteoperosis Foundation Volunteering',
  description:
    'Start volunteering at TOF and make a change in the world today!',
  ogDescription:
    'Start volunteering at TOF and make a change in the world today!',
})

const menuItemClass =
  'bg-gray-100 hover:bg-gray-200 p-3 rounded-md flex items-center gap-2 drop-shadow-sm'
</script>

<template>
  <div class="font-lexend z-50">
    <div
      class="fixed top-0 h-20 w-full max-w-full bg-white flex items-center justify-between shadow z-10 px-4"
    >
      <div class="h-full flex items-center">
        <h1 class="text-xl hidden xl:block">TEXAS OSTEOPOROSIS FOUNDATION</h1>
      </div>
      <div
        class="h-full w-full sm:w-auto justify-between flex items-center sm:gap-8 gap-2 text-lg hidden sm:flex"
      >
        <NuxtLink :class="menuItemClass" to="/event/calendar">
          <Icon name="mdi:calendar" />
          <span class="hidden lg:block">Calendar</span>
        </NuxtLink>
        <NuxtLink :class="menuItemClass" to="/event/listings">
          <Icon name="mdi:list-box-outline" />
          <span class="hidden lg:block">Events</span>
        </NuxtLink>
        <NuxtLink v-if="isAdmin" :class="menuItemClass" to="/event/new">
          <Icon name="mdi:calendar-plus" />
          <span class="hidden lg:block">New Event</span>
        </NuxtLink>
        <NuxtLink :class="menuItemClass" to="/resources">
          <Icon name="mdi:info-outline" />
          <span class="hidden lg:block">Resources</span>
        </NuxtLink>
        <a :class="menuItemClass" href="/api/auth/logout">
          <Icon name="mdi:logout-variant" />
          <span class="hidden lg:block">Log Out</span>
        </a>
        <div class="h-full p-2 aspect-square">
          <NuxtLink to="/users/me/settings">
            <ProfileAvatar class="w-full h-full rounded-full drop-shadow-sm" />
          </NuxtLink>
        </div>
      </div>
      <div class="sm:hidden">
        <button @click="isMenuOpen = !isMenuOpen">
          <!-- Your menu icon goes here -->
          <div v-if="!isMenuOpen">
            <div
              class="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md drop-shadow-sm"
            >
              <Icon name="mdi:menu" />
            </div>
          </div>
          <div v-if="isMenuOpen">
            <div
              class="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md drop-shadow-sm"
            >
              <Icon name="mdi:close" />
            </div>
          </div>
        </button>
        <div
          v-if="isMenuOpen"
          class="absolute top-full left-0 w-full bg-white shadow z-20 pb-5"
        >
          <!-- Your dropdown menu items go here -->
          <NuxtLink
            to="/event/listings"
            class="block px-4 py-2 text-lg hover:bg-gray-200"
            @click="isMenuOpen = !isMenuOpen"
          >
            Events
          </NuxtLink>
          <NuxtLink
            to="/event/calendar"
            class="block px-4 py-2 text-lg hover:bg-gray-200"
            @click="isMenuOpen = !isMenuOpen"
          >
            Calendar
          </NuxtLink>

          <NuxtLink
            v-if="isAdmin"
            class="block px-4 py-2 text-lg hover:bg-gray-200"
            to="/event/new"
            @click="isMenuOpen = !isMenuOpen"
          >
            New Event
          </NuxtLink>

          <NuxtLink
            to="/resources"
            class="block px-4 py-2 text-lg hover:bg-gray-200"
            @click="isMenuOpen = !isMenuOpen"
          >
            Resources
          </NuxtLink>
          <a
            href="/api/auth/logout"
            class="block px-4 py-2 text-lg hover:bg-gray-200"
            @click="isMenuOpen = !isMenuOpen"
          >
            Log Out
          </a>
          <NuxtLink
            to="/users/me/settings"
            class="block px-4 py-2 text-lg hover:bg-gray-200"
            @click="isMenuOpen = !isMenuOpen"
          >
            Profile + Settings
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
