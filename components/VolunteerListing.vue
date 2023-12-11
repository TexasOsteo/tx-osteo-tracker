<script setup lang="ts">
import type { FullEvent } from '~/utils/types'

// Define event prop
const props = defineProps<{
  id: string
  name: string
  type: 'attendee' | 'signed-up'
  eventId: string
}>()

const emit = defineEmits<{
  removed: [newEvent: SerializeObject<FullEvent>]
}>()

async function removeVolunteer() {
  // Remove the volunteer as an attendee or signed up user depending on the type
  const path = props.type === 'attendee' ? 'attendance' : 'register'
  const { data, error } = await useFetch(
    `/api/events/${props.eventId}/${path}/${props.id}`,
    {
      method: 'DELETE',
    },
  )

  // Show error or emit full event back to parent so it can update
  if (error.value || data.value === null) {
    alert(`Could not remove volunteer:\n${error.value}`)
  } else {
    emit('removed', data.value)
  }
}
</script>

<template>
  <div
    class="w-full py-5 px-3 bg-slate-100 shadow opacity-95 flex flex-wrap items-center justify-between rounded-md"
  >
    <div class="h-full align-middle">
      <p class="h-full align-middle">{{ props.name }}</p>
    </div>

    <button
      class="h-full flex flex-wrap items-center justify-center bg-red-600 hover:bg-red-800 p-2 rounded shadow"
      @click="removeVolunteer"
    >
      <Icon class="text-white" size="20" name="mdi:close" />
    </button>
  </div>
</template>
