<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useCurrentUserStore } from '~/store/currentuser'
import type { PositionWithPrereqs } from '~/utils/types'

const props = defineProps<{
  id: string
}>()

const modalOpen = ref(false)
const closedRegistration = ref(false)
const positions = ref<PositionWithPrereqs[] | null>(null)

const userStore = useCurrentUserStore()
if (userStore.currentUser == null) userStore.getUser()

const deregister = computed(
  () => userStore.currentUser?.signedUpEvents.some((ev) => ev.id === props.id),
)

const mainClasses = computed(() => {
  const baseClasses = ' text-white w-full py-3 rounded-md shadow'
  if (deregister.value) return 'bg-red-500 hover:bg-red-800' + baseClasses
  return 'bg-[#0DA49B] hover:bg-white hover:text-black' + baseClasses
})

async function mainButtonPress() {
  if (!deregister.value) {
    modalOpen.value = true
    const { data, error } = await useFetch(`/api/events/${props.id}`)
    if (error.value || !data.value) {
      alert('There was an error fetching the positions for this event.')
      modalOpen.value = false
    } else if (
      new Date(data.value.dateAndTime).getTime() < new Date().getTime()
    ) {
      closedRegistration.value = true
    } else {
      positions.value = data.value.positions
    }
  } else {
    await useFetch(`/api/events/${props.id}/register/me`, {
      method: 'DELETE',
    })
    userStore.update()
  }
}

// Extended positions provide more status info for the registration buttons
const extendedPositions = computed(() => {
  if (!positions.value) return []
  const quals = userStore.currentUser?.verifiedQualifications ?? []
  return positions.value.map((pos) => {
    let disabled = false
    let buttonText = 'Register'
    if (pos.currentCapacity >= pos.maxCapacity) {
      disabled = true
      buttonText = 'Full'
    } else if (
      pos.prerequisites.some((p) => !quals.find((q) => q.id === p.id))
    ) {
      disabled = true
      buttonText = 'Unqualified'
    }
    return {
      position: pos,
      disabled,
      buttonText,
    }
  })
})

async function registerPosition(pos: PositionWithPrereqs) {
  await useFetch(`/api/events/${props.id}/register/me`, {
    method: 'POST',
    body: { position: pos.id },
  })
  userStore.update()
  modalOpen.value = false
}
</script>

<template>
  <VueFinalModal
    v-model="modalOpen"
    class="flex justify-center items-center"
    content-class="flex flex-col lg:6/12 sm:w-8/12 w-full max-h-[90vh] mx-4 p-4 bg-white border rounded-lg space-y-2"
  >
    <h1 class="text-xl font-bold">Choose a position</h1>
    <div v-if="positions === null && !closedRegistration">Loading...</div>
    <h1 v-if="closedRegistration">
      Sorry, but registration has closed for this event
    </h1>
    <div v-if="positions !== null && positions.length == 0">
      There are no available positions for this event.
    </div>
    <div
      v-if="positions !== null && positions.length > 0"
      class="h-max overflow-y-auto"
    >
      <div
        v-for="p in extendedPositions"
        :key="p.position.id"
        class="flex flex-row gap-4 items-center mb-2"
      >
        <button
          :disabled="p.disabled"
          class="w-32 text-white px-3 py-2 rounded-md shadow bg-[#0DA49B] enabled:hover:bg-white enabled:hover:text-black disabled:bg-gray-400"
          @click="() => registerPosition(p.position)"
        >
          {{ p.buttonText }}
        </button>
        <h1 class="text-lg font-semibold">
          {{ p.position.name }} ({{ p.position.currentCapacity }}/{{
            p.position.maxCapacity
          }})
        </h1>
      </div>
    </div>
  </VueFinalModal>
  <button :class="mainClasses" @click="mainButtonPress">
    {{ deregister ? 'DEREGISTER' : 'REGISTER' }}
  </button>
</template>
