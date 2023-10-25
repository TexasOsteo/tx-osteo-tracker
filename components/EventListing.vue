<script setup lang="ts">
import type { Event } from '@prisma/client'
import type { SerializeObject } from '~/utils/types'

// How to define props:
const props = defineProps<{
  // event can either be a normal Event object or a SerializedObject Event
  // This is so that date can be either a string or a Date object since
  // the API call converts a Date object to a string
  event: Event | SerializeObject<Event>
}>()

// How to access prop event in code:
console.log(props.event.name)
</script>

<template>
  <!-- How to access prop in HTML: -->
  <div className="h-screen w-screen bg-slate-500">
    <div className="bg-white mx-20 p-5 rounded-md shadow-xl flex flex-wrap">
      <div className="flex flex-wrap mb-5 w-[90%]">
        <div className="flex flex-wrap items-end">
          <h1 className="text-4xl font-bold font-sans mr-10">
            {{ event.name }}
          </h1>
          <h3 className="mr-20 mt-5">{{ event.capacity }}</h3>
        </div>
        <div className="flex flex-wrap mt-5">
          <h3 className="mr-20 mt-5">{{ event.organizer }}</h3>
          <h3 className="mr-20 mt-5">{{ event.location }}</h3>
          <h3 className="mr-20 mt-5">{{ event.dateAndTime }}</h3>
        </div>
      </div>
      <div className="w-[10%]">
        <button className="bg-red-600">Meow</button>
      </div>
    </div>
  </div>
</template>
