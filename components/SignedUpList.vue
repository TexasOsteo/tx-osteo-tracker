<script setup lang="ts">
import type { EventPosition } from '@prisma/client'

const props = defineProps<{
  eventId: string
  users: SerializeObject<UserWithAdminNotes>[]
  positions: SerializeObject<EventPosition & { users: { id: string }[] }>[]
}>()

const currentUsers = ref([...(props.users ?? [])])
const positions = computed(() => {
  return props.positions
    .map((pos) => {
      return {
        ...pos,
        users: currentUsers.value.filter((u) =>
          pos.users.some((p) => p.id === u.id),
        ),
      }
    })
    .sort((a, b) => a.users.length - b.users.length)
})

async function removeUser(userId: string) {
  const { data } = await useFetch(
    `/api/events/${props.eventId}/register/${userId}`,
    {
      method: 'DELETE',
    },
  )

  if (data) {
    currentUsers.value = currentUsers.value.filter((user) => user.id !== userId)
  }
}
</script>

<template>
  <div class="w-full">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-center">Signed-up Users</h1>
    </div>
    <div class="w-full">
      <div v-for="pos in positions" :key="pos.id" class="mb-8">
        <h1 class="text-2xl mb-2">
          <span class="font-bold">{{ pos.name }}</span>
          ({{ pos.currentCapacity }}/{{ pos.maxCapacity }})
        </h1>
        <div v-if="pos.users.length === 0">
          <h1>No signed-up users yet!</h1>
        </div>
        <div v-if="pos.users.length > 0" class="flex flex-row">
          <h1 class="text-lg flex-1 font-bold">Name</h1>
          <h1 class="text-lg flex-1 font-bold">User Notes</h1>
          <h1 class="text-lg flex-1 font-bold">Admin Notes</h1>
        </div>
        <div
          v-for="user in pos.users"
          :key="user.id"
          class="w-full flex flex-row mt-2 pb-2 border-b-gray-300 border-b-2"
        >
          <div class="flex-1 gap-2 flex flex-row h-min items-center">
            <button @click="removeUser(user.id)">
              <Icon name="mdi:close-box" color="red" size="1.5em" />
            </button>
            <h1 class="text-lg">{{ user.name }}</h1>
          </div>
          <h1 class="text-lg flex-1">{{ user.userNotes }}</h1>
          <h1 class="text-lg flex-1">{{ user.adminNotes?.note ?? '' }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>
