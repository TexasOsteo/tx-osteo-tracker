<script setup lang="ts">
definePageMeta({
  layout: false, // Disable default layout with navbar since this page has a custom one
})
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class=""><CurveBackground /></div>

    <div class="z-10 w-full flex flex-wrap items-center justify-center">
      <div
        class="bg-slate-100 w-4/5 flex flex-wrap items-center justify-center rounded-xl opacity-80 p-10"
        style="height: 120vh"
      >
        <div>
          <h1 class="text-5xl font-bold pb-5 w-full">CHECK IN</h1>
          <input
            type="text"
            class="w-full md: w-20 outline rounded py-5 px-5"
          />
          <button
            class="bg-blue-500 hover: bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
