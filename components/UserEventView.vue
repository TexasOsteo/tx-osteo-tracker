<template>
  <div v-if="user" class="p-4 w-full bg-white rounded shadow text-left">
    <p>
      <strong>Override Register:</strong>
    </p>
    <div v-if="unregisteredEvents.length === 0">
      <p class="pb-2">This user is registered for all events! 🎉</p>
    </div>
    <div v-else v-for="event in unregisteredEvents" :key="event.id">
      <details @toggle="event.isExpanded = $event.target.open">
        <summary>
          <div class="flex items-center cursor-pointer">
            <img
              v-if="event.isExpanded"
              src="/icon-park_up.jpg"
              class="w-5 h-5 mr-2"
            />
            <img v-else src="/icon-park_down.jpg" class="w-5 h-5 mr-2" />
            {{ event.name }}
          </div>
        </summary>

        <div
          v-for="position in event.positions"
          :key="position.id"
          class="pl-7"
        >
          <input
            type="checkbox"
            :name="event.id"
            :value="position.id"
            class="mr-1"
            @change="
              updateSelectedPositions(
                event.id,
                position.id,
                ($event.target as HTMLInputElement).checked,
              )
            "
          />
          <span>{{ position.name }}</span>
        </div>
      </details>
    </div>
    <!--Object.keys(selectedPositions).length EXPLAINED:
    If selectedPositions has one or more keys (i.e., one or more events have been selected),
    Object.keys(selectedPositions) will return an array of those keys (the event IDs).
    For example, if selectedPositions is
     { 'event1': 
        ['position1', 'position2'],  
        'event2': 
        ['position1'] }, 
    Object.keys(selectedPositions) will return ['event1', 'event2']. 
    If selectedPositions is {}, Object.keys(selectedPositions) will return []
    -->
    <button
      :disabled="!Object.keys(selectedPositions).length"
      :class="[
        'px-4',
        'py-2',
        'mt-4',
        'rounded',
        'transition-colors',
        'duration-200',
        Object.keys(selectedPositions).length
          ? 'text-[#FDFAF0] bg-yellow-500 hover:bg-yellow-550'
          : 'text-[#FDFAF0] bg-gray-500',
      ]"
      @click="registerUser"
    >
      Register
    </button>
  </div>
</template>

<script setup lang="ts">
interface EventPositions {
  id: string
  name: string
}

interface Event {
  id: string
  name: string
  positions: EventPositions[]
}

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  signedUpEvents: Event[]
}

const props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
})

const allEvents = ref<Event[]>([])
const unregisteredEvents = ref<Event[]>([])

onMounted(async () => {
  // Fetch all events, unregisteredEvents is the disunion between allEvents and user.signedUpEvents
  const response = await fetch(`/api/events/`)
  if (!response.ok) {
    throw new Error('Failed to fetch user details')
  }
  allEvents.value = await response.json()

  unregisteredEvents.value = allEvents.value.filter(
    (event) => !props.user.signedUpEvents.map((e) => e.id).includes(event.id),
  )
})

// Formats 'form' data to be looped through for api call
// Results in:
/*
   {
  "c1c60617-e255-49f8-aeba-36405243c8cf": [ <- event1 id
    "77fb75e3-23dc-4495-9ea4-fb7a70a10090" <- position id
  ],
  "57763e4e-0607-4956-b5ad-354df1ed67f1": [ <- event2 id
    "fd9b01e8-a993-463f-979c-b17ece8e9eed", <- position id
    "7666b092-b01c-4509-aaa3-de3f9e00c8f9" <- position id
  ]
}
*/

const selectedPositions = ref<Record<string, string[]>>({})

const updateSelectedPositions = (
  eventId: string,
  positionId: string,
  checked: boolean,
) => {
  if (checked) {
    if (selectedPositions.value[eventId]) {
      selectedPositions.value[eventId].push(positionId)
    } else {
      selectedPositions.value[eventId] = [positionId]
    }
  } else {
    const index = selectedPositions.value[eventId].indexOf(positionId)
    if (index !== -1) {
      selectedPositions.value[eventId].splice(index, 1)
    }
  }
}

// API call to make: POST /api/events/[event id]/register/[user id]
// pass "position": "id" in the request body
// Loop through selectedPositions and make the API call for each position, admin override

const registerUser = async () => {
  for (const eventId in selectedPositions.value) {
    for (const positionId of selectedPositions.value[eventId]) {
      const response = await fetch(
        `/api/events/${eventId}/register/${props.user.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ position: positionId }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to register user')
      }
    }
  }
}
</script>

<style scoped>
details > summary {
  list-style: none;
}

details > summary::-webkit-details-marker {
  display: none;
}
</style>
