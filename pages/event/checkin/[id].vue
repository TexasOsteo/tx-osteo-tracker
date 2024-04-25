<script setup lang="ts">
const route = useRoute()
const eventId = route.params.id as string

const inputCode = ref('') // to hold the value of the input field

async function checkCode() {
  const { error } = await useFetch(`/api/events/${eventId}/attendance/me`, {
    method: 'POST',
    body: {
      code: inputCode.value,
    },
  })
}


</script>

<template>
  <div class="flex justify-center items-center h-[90vh]">
    <div class=""><CurveBackground /></div>

    <div class=" w-full flex flex-wrap items-center justify-center">
      <div
        class="bg-slate-100 w-full lg:w-1/2 flex flex-wrap items-center justify-center rounded-xl opacity-80 p-10 mx-2"
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
</template>
