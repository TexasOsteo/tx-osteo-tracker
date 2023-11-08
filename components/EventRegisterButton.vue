<script setup lang="ts">
import { useCurrentUserStore } from '~/store/currentuser'

const props = defineProps<{
  id: string
}>()

const userStore = useCurrentUserStore()
if (userStore.currentUser == null) await userStore.getUser()

const deregister = computed(
  () => userStore.currentUser?.signedUpEvents.some((ev) => ev.id === props.id),
)

const classes = computed(() => {
  const baseClasses = ' text-white w-full py-3 rounded-md'
  if (deregister.value) return 'bg-red-500 hover:bg-red-800' + baseClasses
  return 'bg-[#0DA49B] hover:bg-white hover:text-black' + baseClasses
})

async function buttonPress() {
  if (deregister.value) {
    await useFetch(`/api/events/${props.id}/register/me`, {
      method: 'DELETE',
    })
  } else {
    await useFetch(`/api/events/${props.id}/register/me`, {
      method: 'POST',
    })
  }

  userStore.update()
}
</script>

<template>
  <button :class="classes" :onclick="buttonPress">
    {{ deregister ? 'DEREGISTER' : 'REGISTER' }}
  </button>
</template>
