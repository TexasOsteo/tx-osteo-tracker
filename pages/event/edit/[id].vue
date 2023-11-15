<script setup lang="ts">
import ISO6391 from 'iso-639-1'
import type { Event } from '@prisma/client'
import type { SerializeObject } from '~/utils/types'

const route = useRoute()
const { data } = await useFetch(`/api/events/${route.params.id}`)
console.log(data)
// const nameRef = ref({data?.name})
const props = defineProps<{
  id: string
}>()
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
          <FormKit
            type="form"
            :errors="formErrors"
            class-name="items-center"
            @submit="handleSubmit"
          >
            <!--Title of Event -->
            <div class="flex justify-center items-center flex-wrap">
              <FormKit
                id="title"
                v-model="nameRef"
                type="text"
                name="name"
                label="Name"
                help="Type event name here."
                placeholder={{data.name}}
                outer-class="mb-5 w-4/5"
              />

              <!--Name of Organizer-->
              <FormKit
                id="organizer"
                type="text"
                name="organizer"
                label="Organizer"
                help="Type organization name here."
                placeholder="data.organizer"
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
              <FormKit
                id="thumbnail"
                type="file"
                label="Thumbnail"
                name="thumbnail"
                accept=".png,.pdf,.jpeg"
                help="Upload a thumbnail for the event listing. Accepted formats: .png, .pdf, .jpeg."
                multiple="false"
                outer-class="mb-5 w-4/5"
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
                outer-class="event.email"
              />

              <!--Capacity-->
              <FormKit
                id="capacity"
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
                type="textarea"
                name="description"
                label="Description"
                help="Type a description of this event"
                outer-class="mb-5 w-4/5"
              />

              <TextMultiple
                title="Volunteer Prerequisites"
                placeholder="event.prerquisites"
                add-text="Add new prerequisite"
                name="prerequisites"
                empty
              />

              <TextMultiple
                title="Volunteer Positions"
                placeholder="event.voluterrPositions"
                add-text="Add new position"
                name="volunteerPositions"
                empty
              />
            </div>
          </FormKit>
          <div class="">
            <h1>Delete Event</h1>
          </div>
        </div>
      </div>
      <div class="w-1/2 z-30 pr-5 pl-2.5">
        <div class="bg-slate-100 h-screen rounded-3xl p-10 opacity-95">
          <p>{{ props.id }}</p>
          <VolunteerListing :id="props.id" />
        </div>
      </div>
    </div>
  </div>
</template>
