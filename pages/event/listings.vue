<script setup lang="ts">
// Fetch API call by destructing the events response object into its data
const { data: eventsRes } = await useFetch(`/api/events?after=${Date.now()}`)
const events = computed(() => {
  const arr = eventsRes.value ?? []
  // Sort events by date
  arr.sort(
    (a, b) =>
      new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime(),
  )
  return arr
})

const eventFilter = ref({
  selectedLocation: 'all',
  selectedOrganization: 'all',
  selectedDate: '',
})

const cities = computed(() =>
  Array.from(new Set(events.value.map((event) => event.location))),
)
const organizations = computed(() =>
  Array.from(new Set(events.value.map((event) => event.organizer))),
)

// Function runs every time eventFilter is updated to provide an updated variable
// that stores all the events that should be displayed
const eventsToDisplay = computed(() => {
  const locationFilter = eventFilter.value.selectedLocation
  const organizationFilter = eventFilter.value.selectedOrganization
  const dateFilter = eventFilter.value.selectedDate
    ? new Date(eventFilter.value.selectedDate)
    : null
  // Show all events if filters are default
  if (locationFilter === 'all' && organizationFilter === 'all' && !dateFilter) {
    return events.value
  }
  // Filter events in corresponding way
  else {
    const filteredEvents = events.value.filter((event) => {
      // Filter all three
      if (
        locationFilter !== 'all' &&
        organizationFilter !== 'all' &&
        dateFilter
      ) {
        return (
          event.location === locationFilter &&
          event.organizer === organizationFilter &&
          new Date(event.dateAndTime) >= dateFilter
        )
      }
      // Filter time
      else if (
        locationFilter === 'all' &&
        organizationFilter === 'all' &&
        dateFilter
      ) {
        return new Date(event.dateAndTime) >= dateFilter
      }
      // Filter location and time
      else if (
        locationFilter !== 'all' &&
        organizationFilter === 'all' &&
        dateFilter
      ) {
        return (
          event.location === locationFilter &&
          new Date(event.dateAndTime) >= dateFilter
        )
      }
      // Filter organizations and time
      else if (
        locationFilter === 'all' &&
        organizationFilter !== 'all' &&
        dateFilter
      ) {
        return (
          event.organizer === organizationFilter &&
          new Date(event.dateAndTime) >= dateFilter
        )
      }
      // Filter organizations
      else if (
        locationFilter === 'all' &&
        organizationFilter !== 'all' &&
        !dateFilter
      ) {
        return event.organizer === organizationFilter
      }
      // Filter locations
      else if (
        locationFilter !== 'all' &&
        organizationFilter === 'all' &&
        !dateFilter
      ) {
        return event.location === locationFilter
      }
      // Filter organizations and locations
      else {
        return (
          event.location === locationFilter &&
          event.organizer === organizationFilter
        )
      }
    })
    return filteredEvents
  }
})

// ------------------------------------------------------------------------------------------
</script>
<template>
  <div >
    <h1 class="text-center text-5xl pt-10 font-semibold">Sign Up</h1>
    <div class="flex flex-wrap items-center justify-center">
      <table class="border-separate border-spacing-10">
        <tr class="text-center place-content-strech self-auto">
          <th>
            <!--Filter events by Location-->
            <label
              class="block font-bold text-center text-black"
              for="locationFilter"
              >Location</label
            >
            <div class="bg-slate-200 p-2 m-2 rounded-lg">
              <select
                id="locationFilter"
                v-model="eventFilter.selectedLocation"
                class="text-center bg-slate-200"
              >
                <option value="all">All</option>
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>
          </th>
          <th>
            <!--Filter events by Organization-->
            <label
              class="block font-bold text-center text-black"
              for="organizationFilter"
              >Organization</label
            >
            <div class="bg-slate-200 p-2 m-2 rounded-lg">
              <select
                id="organizationFilter"
                v-model="eventFilter.selectedOrganization"
                class="text-center bg-slate-200"
              >
                <option value="all">All</option>
                <option
                  v-for="organization in organizations"
                  :key="organization"
                  :value="organization"
                >
                  {{ organization }}
                </option>
              </select>
            </div>
          </th>
          <th>
            <!--Filter events by Date and Time-->
            <label
              class="block font-bold text-center text-black"
              for="timeFilter"
              >Date</label
            >
            <div class="bg-slate-200 p-2 m-2 rounded-lg">
              <input
                id="timeFilter"
                v-model="eventFilter.selectedDate"
                type="date"
                class="text-center bg-slate-200"
              />
            </div>
          </th>
        </tr>
      </table>
    </div>

    <ul>
      <li v-for="event in eventsToDisplay" :key="event.id">
        <div>
          <EventListing :event="event"> </EventListing>
        </div>
      </li>
    </ul>
  </div>
</template>
