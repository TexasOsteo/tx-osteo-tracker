<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import type { Event } from '@prisma/client'
import { generateEventCode } from '../../../utils/universal'
import type { SerializeObject, FullEvent } from '~/utils/types'

type Position = {
  id: string
  name: string
  currentCapacity: number
  maxCapacity: number
  eventId: string
  prerequisites: (string | { id: string; name: string })[]
}

// Custom types used by FormKit
type SFullEvent = SerializeObject<FullEvent> & { positions: Position[] }
type FormKitEventData = Partial<
  SerializeObject<Event> & {
    attendees: string[]
    signedUpUsers: string[]
    positions: Position[]
  }
>

const router = useRouter()
const route = useRoute()
const eventId = route.params.id as string
const userClaims = getCurrentUserTxOsteoClaims()
const userId = userClaims!.sub

const { data: usersData } = await useFetch('/api/users')
const { data: fullEventData } = await useFetch(`/api/events/${eventId}`)

// This converts the serialized response from useFetch to an Event partial usable by FormKit
function toFormData(event: SFullEvent | null): FormKitEventData {
  if (!event) return {}
  return {
    ...event,
    // Formkit needs date in this format:
    dateAndTime: format(new Date(event.dateAndTime), `yyyy-MM-dd'T'HH:MM`),
    // Convert volunteers into id strings
    attendees: event.attendees.map((user) => user.id),
    signedUpUsers: event.signedUpUsers.map((user) => user.id),
    positions: event.positions,
  } as FormKitEventData
}

// This ref updates with when FormKit updates and when useFetch updates using watch
const formData = ref<FormKitEventData>(toFormData(fullEventData.value))
watch(fullEventData, (value) => (formData.value = toFormData(value)))
const formErrors = ref<string[]>()

const allUsers = computed(() =>
  Object.fromEntries(
    (usersData.value ?? []).map((u) => [u.id, `${u.name} (${u.email})`]),
  ),
)

const generateCode = () => {
  formData.value.code = generateEventCode()
}

async function deleteEvent() {
  const { error } = await useFetch(`/api/events/${eventId}`, {
    method: 'DELETE',
  })
  if (error.value) {
    formErrors.value = [
      'There was an error deleting this event.',
      error.value.message,
    ]
  } else {
    router.go(-1)
  }
}

async function patchEvent(fields: any) {
  // console.log(JSON.stringify(fields))
  const { error } = await useFetch(`/api/events/${eventId}`, {
    method: 'PUT',
    body: fields,
  })
  if (error.value) {
    formErrors.value = [
      'There was an error updating this event.',
      error.value.message,
    ]
  } else {
    router.go(-1)
  }
}
</script>

<template>
  <div class="py-20 flex justify-center flex-wrap items-center">
    <CurveBackground />

    <div
      class="max-w-screen-lg bg-gray-100 opacity-95 rounded-3xl shadow-xl z-30 p-10 flex justify-center flex-wrap items-center"
    >
      <h1 class="title font-sans font-bold text-5xl text-center mb-10">
        EDIT EVENT
      </h1>
      <FormKit
        v-model="formData"
        type="form"
        :errors="formErrors"
        class-name="items-center"
        @submit="patchEvent"
      >
        <!--Title of Event -->
        <div class="flex justify-center items-center flex-wrap">
          <FormKit
            id="title"
            type="text"
            name="name"
            label="Name"
            help="Type event name here."
            placeholder="Event Name"
            outer-class="mb-5 w-4/5"
          />

          <!--Name of Organizer-->
          <FormKit
            id="organizer"
            type="text"
            name="organizer"
            label="Organizer"
            help="Type organization name here."
            placeholder="Event Organizer"
            outer-class="mb-5 w-4/5"
          />

          <!--Location-->
          <FormKit
            id="loc"
            type="text"
            name="location"
            label="Location"
            help="Enter the street address followed by the city, state, and zipcode."
            placeholder="data.location"
            outer-class="mb-5 w-4/5"
          />

          <!--Date-->
          <FormKit
            id="event_date"
            type="datetime-local"
            name="dateAndTime"
            label="Date and Time"
            help="Enter the date and time of the event"
            validation="required|date_after"
            outer-class="mb-5 w-4/5"
            :validation-messages="{
              date_after: 'Enter a date that has not yet occurred',
            }"
          />

          <!--Duration-->
          <FormKit
            id="duration"
            type="number"
            help="Enter the duration of the event (around how many hours?)"
            label="Duration"
            name="duration"
            placeholder="event.duration"
            step="0.5"
            outer-class="mb-5 w-4/5"
          />

          <!--HoursOffered -->
          <FormKit
            id="hoursOffered"
            type="number"
            help="How many hours can a volunteer earn at this event?"
            label="Volunteer Hours Offered"
            name="hoursOffered"
            placeholder="event.hoursOffered"
            step="0.5"
            outer-class="mb-5 w-4/5"
          />

          <!--Thumbnail-->
          <ImageSelect
            type="thumbnail"
            name="thumbnail"
            label="Select a thumbnail"
            validation="required"
          />

          <!--Phone Number-->
          <FormKit
            id="phone_number"
            type="tel"
            name="phoneNumber"
            label="Organization Phone Number"
            help="Type the phone number of the event organizer"
            outer-class="mb-5 w-4/5"
            placeholder="event.phone_number"
          />

          <!--Email-->
          <FormKit
            id="email"
            type="email"
            name="email"
            label="Organization Email"
            help="Type the email of the event organizer"
            placeholder="emailexample@domain.com"
            outer-class="mb-5 w-4/5"
          />

          <LanguageSelect />

          <!--Description-->
          <FormKit
            id="description"
            type="textarea"
            name="description"
            label="Description"
            help="Type a description of this event"
            outer-class="mb-5 w-4/5"
          />

          <!-- <TextMultiple
            title="Volunteer Positions"
            placeholder="Enter new position"
            add-text="Add new position"
            name="volunteerPositions"
            empty
            /> -->
          <PositionCapacity mode="edit" />

          <h1 class="title font-sans font-bold text-4xl text-center mt-8 mb-4">
            MODIFY VOLUNTEERS
          </h1>

          <SelectMultiple
            :options="allUsers"
            title="Signed Up Users"
            add-text="Sign up new user"
            :default-value="userId"
            name="signedUpUsers"
            validation="noDuplicates"
          />

          <SelectMultiple
            :options="allUsers"
            title="Attendees"
            add-text="Add new attendee"
            :default-value="userId"
            name="attendees"
            validation="noDuplicates"
          />

          <h1 class="title font-sans font-bold text-4xl text-center mt-8 mb-4">
            GENERATE CODE
          </h1>
          <div class="flex justify-center items-center flex-wrap">
            <FormKit
              id="code"
              type="text"
              name="code"
              label="Event Code"
              help="This code is used to check in volunteers"
              placeholder="Event Code"
              outer-class="mb-5 w-4/5"
            />
          </div>
          <FormKit
            type="button"
            help="You can bind event listeners."
            @click="generateCode"
          >
            Click me!
          </FormKit>
        </div>
      </FormKit>
      <button
        class="bg-red-600 w-full text-center py-3.5 rounded-lg text-md text-white"
        @click="deleteEvent"
      >
        Delete Event
      </button>
      <!-- formData is new Data sent to api, fullEventData is old data, what is currently in database before PUT  -->
      <pre>{{ formData }}</pre>
      <br />
      <pre> {{ fullEventData }}</pre>
    </div>
  </div>
</template>
