<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const eventId = route.params.id as string
const { data: fullEventData } = await useFetch(`/api/events/${eventId}`)
const { data } = await useFetch('/api/users/me')
const userID = ref(data && data.value ? [data.value.id] : [])



const eventCode = ref('')

async function updateCode() {
  eventCode.value = generateEventCode()
  await useFetch(`/api/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify({
      code: eventCode.value,
    }),
  })
}
</script>

<template>
  <div class="flex justify-center flex-wrap items-center">
    <div class=""><CurveBackground /></div>

    <div class="w-full h-[90vh] flex flex-wrap items-center justify-center">
      <div
        class="w-1/2 flex flex-wrap items-center justify-center rounded-xl z-20 bg-white bg-opacity-80 p-10"
      >
        <div class="z-30">
          <h1 class="text-5xl font-bold pb-5 w-full text-center">
            ATTENDANCE CODE
          </h1>
          <h1
            class="text-5xl font-bold lg:text-9xl md:text-7xl text-center pb-5"
          >
            {{ eventCode }}
          </h1>
          <div class="w-full flex flex-wrap items-center justify-between">
            <button
              class="bg-[#0DA49B] py-3 px-5 font-medium text-xl text-white rounded-xl hover:bg-[#F0CC5A] hover:text-black transition duration-300 ease-in-out"
              :onclick="updateCode"
            >
              New Code
            </button>
            <NuxtLink :to="`/event/listings`">
              <div
                class="py-3 px-5 text-xl text-black font-semibold rounded-xl hover:bg-[#F0CC5A] transition duration-300 ease-in-out"
              >
                Back
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
