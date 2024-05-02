<script setup lang="ts">
const props = defineProps<{
  user: SerializeObject<FullUser>
}>()

const { data: fetchedEvents } = await useFetch('/api/events')
const allEvents = computed(() => {
  const copiedEvents = [...(fetchedEvents.value ?? [])]
  copiedEvents.sort(
    (a, b) =>
      new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime(),
  )
  return copiedEvents
})

const updatedAttendance = ref(props.user.eventHistory.map((e) => e.id))

function hasAttended(eventId: string) {
  return updatedAttendance.value.includes(eventId)
}

async function updateAttendence(eventId: string) {
  if (hasAttended(eventId)) {
    const { data } = await useFetch(
      `/api/events/${eventId}/attendance/${props.user.id}`,
      {
        method: 'DELETE',
      },
    )
    if (data.value) {
      updatedAttendance.value = updatedAttendance.value.filter(
        (id) => id !== eventId,
      )
    }
  } else {
    const { data } = await useFetch(
      `/api/events/${eventId}/attendance/${props.user.id}`,
      {
        method: 'POST',
      },
    )
    if (data.value) {
      updatedAttendance.value.push(eventId)
    }
  }
}
</script>

<template>
  <div v-if="user" class="p-4 w-full bg-white rounded shadow text-left">
    <p>
      <strong>Override Attendance:</strong>
    </p>
    <div
      v-for="event in allEvents"
      :key="event.id"
      class="flex flex-row justify-between items-center"
    >
      <h1>{{ event.name }}</h1>
      <button
        :class="[
          'px-4',
          'py-2',
          'mt-4',
          'rounded',
          'transition-colors',
          'duration-200',
          hasAttended(event.id)
            ? 'text-[#FDFAF0] bg-yellow-500 hover:bg-yellow-600'
            : 'text-[#FDFAF0] bg-gray-500 hover:bg-gray-600',
        ]"
        @click="updateAttendence(event.id)"
      >
        {{ hasAttended(event.id) ? 'Remove' : 'Add' }}
      </button>
    </div>
  </div>
</template>
