<script setup lang="ts">
import { useCurrentUserStore } from '~/store/currentuser'
const router = useRouter()
const route = useRoute()
const eventId = route.params.id as string
const { data: fullEventData } = await useFetch(`/api/events/${eventId}`)
const { data } = await useFetch('/api/users/me')
const userID = ref(data && data.value ? [data.value.id] : [])
// Now you can use the function
const eventCode = generateEventCode()

const props = defineProps<{
  id: string
}>()

const userStore = useCurrentUserStore()
if (userStore.currentUser == null) await userStore.getUser()

const inputCode = ref('') // to hold the value of the input field

async function checkCode() {
  if (
    inputCode.value === fullEventData.value?.code &&
    fullEventData.value?.code !== undefined
  ) {
    await useFetch(`/api/events/${eventId}/attendance/me`, {
      method: 'POST',
    })
    await useFetch(`/api/users/${data.value?.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        numHours:
          (data.value?.numHours || 0) +
          (fullEventData.value?.hoursOffered || 0),
      }),
    })
  } else {
    console.log('Invalid code')
  }
}

definePageMeta({
  layout: false, // Disable default layout with navbar since this page has a custom one
})
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class=""><CurveBackground /></div>

    <div class="z-10 w-full flex flex-wrap items-center justify-center">
      <div
        class="bg-slate-100 w-1/2 flex flex-wrap items-center justify-center rounded-xl opacity-80 p-10"
        style="text-align: center"
      >
        <div>
          <h1 class="text-5xl font-bold pb-5 w-full">CHECK IN</h1>
          <input
            v-model="inputCode"
            type="text"
            class="w-full outline rounded"
            style="width: 100%; padding: 7px; margin-bottom: 16px"
          />

          <button
            :onclick="checkCode"
            style="
              background-color: #008b8b;
              color: white;
              padding: 8px 16px;
              border: none;
              border-radius: 4px;
              margin-left: auto;
              margin-right: auto;
              display: block;
              margin-top: 16px;
            "
          >
            Check Code
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
