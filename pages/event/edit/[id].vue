<script setup lang="ts">
import { ref } from 'vue'
import ISO6391 from 'iso-639-1'
import type { Event } from '@prisma/client'
import type { SerializeObject } from '~/utils/types'
const formErrors = ref<string[]>()

const route = useRoute()
const { data } = await useFetch(`/api/events/${route.params.id}`)

const referID = ref(data && data.value ? [data.value.id] : [])
const referName = ref(data && data.value ? [data.value.name] : [])
const referOrg = ref(data && data.value ? [data.value.organizer] : [])
const referLoc = ref(data && data.value ? [data.value.location] : [])
const referDatm = ref(data && data.value ? [data.value.dateAndTime] : [])
const referVolun = ref(data && data.value ? [data.value.signedUpUsers] : [])
const formattedDatm = referDatm.value.toLocaleString().slice(0, 16)
const referDur = ref(data && data.value ? [data.value.duration] : [])
const referHour = ref(data && data.value ? [data.value.hoursOffered] : [])
const referCap = ref(data && data.value ? [data.value.capacity] : [])
const referPhNum = ref(data && data.value ? [data.value.phoneNumber] : [])
const referMail = ref(data && data.value ? [data.value.email] : [])
const referPrereq = ref(data && data.value ? [data.value.prerequisites] : [])
const referPos = ref(data && data.value ? [data.value.volunteerPositions] : [])
const referDesc = ref(data && data.value ? [data.value.description] : [])
const props = defineProps<{
  id: string
}>()

async function deleteEvent() {
  await useFetch(`/api/events/${referID.value}`, {
    method: 'DELETE',
  })
}

async function patchEvent(fields: any) {
  const { error } = await useFetch(`/api/events/${referID.value}`, {
    method: 'PUT',
    body: {
      ...fields,
    },
  })
  if (error.value) {
    formErrors.value = [
      'There was an error updating this event.',
      error.value.message,
    ]
  }
}
</script>

<template>
  <div class="py-10 flex flex-wrap items-center">
    <CurveBackground />
    <div class="flex flex-wrap">
      <div class="w-1/2 pl-5 pr-2.5">
        <div
          class="w-full bg-gray-100 opacity-95 rounded-3xl shadow-xl z-30 p-10 flex justify-center flex-wrap items-center"
        >
          <h1 class="title font-sans font-bold text-5xl text-center mb-10">
            EDIT EVENT
          </h1>
          <p></p>
          <FormKit
            type="form"
            :errors="formErrors"
            class-name="items-center"
            @submit="patchEvent"
          >
            <!--Title of Event -->
            <div class="flex justify-center items-center flex-wrap">
              <FormKit
                id="title"
                v-model="referName"
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
                v-model="referOrg"
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
                v-model="referLoc"
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
                v-model="formattedDatm"
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
                v-model="referDur"
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
                v-model="referHour"
                type="number"
                help="How many hours can a volunteer earn at this event?"
                label="Volunteer Hours Offered"
                name="hoursOffered"
                placeholder="event.hoursOffered"
                step="0.5"
                outer-class="mb-5 w-4/5"
              />

              <!--Thumbnail-->
              <FormKit
                id="thumbnail"
                type="file"
                label="Thumbnail"
                name="thumbnail"
                accept=".png,.pdf,.jpeg"
                help="Upload a thumbnail for the event listing. Accepted formats: .png, .pdf, .jpeg."
                multiple="fal "
                outer-class="mb-5 w-4/5"
              />

              <!--Phone Number-->
              <FormKit
                id="phone_number"
                v-model="referPhNum"
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
                v-model="referMail"
                type="email"
                name="email"
                label="Organization Email"
                help="Type the email of the event organizer"
                placeholder="emailexample@domain.com"
                outer-class="mb-5 w-4/5"
              />

              <!--Capacity-->
              <FormKit
                id="capacity"
                v-model="referCap"
                type="number"
                name="capacity"
                label="event.capacity"
                help="Type the maximum capacity of volunteers for this event"
                step="1"
                outer-class="mb-5 w-4/5"
                placeholder="50"
              />

              <LanguageSelect />

              <!--Description-->
              <FormKit
                id="description"
                v-model="referDesc"
                type="textarea"
                name="description"
                label="Description"
                help="Type a description of this event"
                outer-class="mb-5 w-4/5"
              />

              <TextMultiple
                v-model="referPrereq"
                title="Volunteer Prerequisites"
                placeholder="event.prerquisites"
                add-text="Add new prerequisite"
                name="prerequisites"
                empty
              />

              <TextMultiple
                v-model="referPos"
                title="Volunteer Positions"
                placeholder="event.voluterrPositions"
                add-text="Add new position"
                name="volunteerPositions"
                empty
              />
            </div>
          </FormKit>
          <div
            class="bg-red-600 w-full text-center py-3.5 rounded-lg text-md text-white"
          >
            <a href="/event/listings" @click="deleteEvent"> Delete Event </a>
          </div>
        </div>
      </div>
      <div class="w-1/2 z-30 pr-5 pl-2.5">
        <div class="bg-gray-100 h-screen rounded-3xl p-10 opacity-95">
          <!-- <div v-if="referVolun.length > 0">
            <div v-for="(name, index) in referVolun" :key="index">
              <VolunteerListing :id="props.id" :name="name[0].name" />
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
