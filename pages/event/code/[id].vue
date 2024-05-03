<script setup lang="ts">
const route = useRoute()
const eventId = route.params.id as string
const { data: fullEventData } = await useFetch(`/api/events/${eventId}`)

const eventCode = ref(fullEventData.value?.code ?? '')

async function updateCode() {
  eventCode.value = generateEventCode()
  await useFetch(`/api/events/${eventId}`, {
    method: 'PUT',
    body: {
      code: eventCode.value,
    },
  })
}
</script>

<template>
  <div class="flex justify-center flex-wrap items-center">
    <div class="-z-50"><CurveBackground /></div>

    <div
      class="w-full h-[90vh] flex flex-wrap items-center justify-center mx-2"
    >
      <div
        class="w-full md:w-1/2 flex flex-wrap items-center justify-center rounded-xl bg-white bg-opacity-95 md:bg-opacity-80 shadow-2xl backdrop-blur-none md:backdrop-blur-md z-0 p-10 px-5"
      >
        <div class="">
          <h1 class="text-4xl lg:text-5xl font-bold pb-5 w-full text-center">
            ATTENDANCE CODE
          </h1>
          <h1
            class="text-5xl font-bold lg:text-9xl md:text-7xl text-center pb-5"
          >
            {{ eventCode }}
          </h1>
          <div
            class="w-full flex flex-wrap items-center justify-between text-sm"
          >
            <button
              class="bg-[#0DA49B] py-3 px-5 text-xl text-white rounded-xl hover:bg-[#F0CC5A] hover:text-black transition duration-300 ease-in-out"
              @click="updateCode"
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
