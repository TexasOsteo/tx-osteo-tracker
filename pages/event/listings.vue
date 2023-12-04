<script setup lang="ts">
// Fetch API call by destructing the events response object into its data
const { data: events } = await useFetch(`/api/events?after=${Date.now()}`)
// Define a ref variable to store the user-inputted date
const filterOrg = ref('')

const filterDate = ref('')


const filterLoc = ref('')
</script>
<template>
  <h1 class="text-center text-5xl my-10 font-semibold">Sign Up</h1>
  <div class="flex flex-wrap items-center justify-center">
    <div>
      <label for="filterOrg">Organizer: </label>
      <input
        id="filterOrg"
        v-model="filterOrg"
        placeholder="-"
        class="bg-slate-200 m-3 p-2 rounded-lg"
      />
    </div>

    <div>
      <label for="filterLoc">Location: </label>
      <input
        id="filterLoc"
        v-model="filterLoc"
        placeholder="-"
        class="bg-slate-200 m-3 p-2 rounded-lg"
      />
    </div>

    <div>
      <label for="date">Date:</label>
      <input
        id="date"
        v-model="filterDate"
        type="date"
        class="bg-slate-200 m-3 p-2 rounded-lg"
      />
    </div>

    <div>
      <label for="time">Time:</label>
      <input
        id="time"
        v-model="filterTime"
        type="time"
        class="bg-slate-200 m-3 p-2 rounded-lg"
      />
    </div>

    <div>
      <label for="position">Volunteer Positions:</label>
      <select id="position" class="bg-slate-200 m-3 p-2.5 rounded-lg">
        <option value="both">Both</option>
        <option value="regular">Regular Volunteer Only</option>
        <option value="medical">Medical Volunteer Only</option>
      </select>
    </div>
  </div>

  <ul>
    <li v-for="event in events" :key="event.id">
      <div
        v-if="
          (!filterLoc || event.location.includes(filterLoc)) &&
          (!filterOrg || event.organizer.includes(filterOrg))
        "
      >
        <EventListing :event="event"> </EventListing>
      </div>
    </li>
  </ul>
</template>
