<script setup lang="ts">
const props = defineProps<{
  eventId: string
  users: SerializeObject<UserWithAdminNotes>[]
}>()

const currentUsers = ref([...(props.users ?? [])])

async function removeAttendee(userId: string) {
  const { data } = await useFetch(
    `/api/events/${props.eventId}/attendance/${userId}`,
    {
      method: 'DELETE',
    },
  )

  if (data.value) {
    currentUsers.value = currentUsers.value.filter((user) => user.id !== userId)
  }
}
</script>

<template>
  <div class="w-full mb-20">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-center">Attendees</h1>
      <h2 v-if="currentUsers.length === 0" class="text-center mt-2">
        No attendees yet!
      </h2>
      <h2 class="text-center">
        You can manually mark attendance
        <NuxtLink to="/admins" class="underline">here.</NuxtLink>
      </h2>
    </div>
    <div class="w-full">
      <div v-if="currentUsers.length > 0" class="flex flex-row">
        <h1 class="text-lg flex-1 font-bold">Name</h1>
        <h1 class="text-lg flex-1 font-bold">User Notes</h1>
        <h1 class="text-lg flex-1 font-bold">Admin Notes</h1>
      </div>
      <div
        v-for="user in currentUsers"
        :key="user.id"
        class="w-full flex flex-row mt-2 pb-2 border-b-gray-300 border-b-2"
      >
        <div class="flex-1 gap-2 flex flex-row h-min items-center">
          <button @click="removeAttendee(user.id)">
            <Icon name="mdi:close-box" color="red" size="1.5em" />
          </button>
          <h1 class="text-lg">{{ user.name }}</h1>
        </div>
        <h1 class="text-lg flex-1">{{ user.userNotes }}</h1>
        <h1 class="text-lg flex-1">{{ user.adminNotes?.note ?? '' }}</h1>
      </div>
    </div>
  </div>
</template>
