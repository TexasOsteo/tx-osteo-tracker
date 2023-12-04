<script setup lang="ts">
const formErrors = ref<string[]>()

async function handleSubmit(fields: any) {
  const { error } = await useFetch('/api/events', {
    method: 'POST',
    body: {
      ...fields,
      attendees: [],
      signedUpUsers: [],
    },
  })

  if (error.value) {
    formErrors.value = [
      'There was an error creating this event.',
      error.value.message,
    ]
  } else {
    const router = useRouter()
    router.go(-1)
  }
}
</script>

<!--Form-->
<template>
  <div class="py-20 flex justify-center flex-wrap items-center">
    <CurveBackground />

    <div
      class="max-w-screen-lg bg-gray-100 opacity-95 rounded-3xl shadow-xl z-30 p-10 flex justify-center flex-wrap items-center"
    >
      <h1 class="title font-sans font-bold text-5xl text-center mb-10">
        CREATE EVENT
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
            placeholder="Organization Name"
            outer-class="mb-5 w-4/5"
          />

          <!--Location-->
          <FormKit
            id="loc"
            type="text"
            name="location"
            label="Location"
            help="Enter the street address followed by the city, state, and zipcode."
            placeholder="3333 Bones St, Austin, TX 77777"
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
            placeholder="6"
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
            placeholder="2"
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
            placeholder="(+X) XXX-XXX-XXXX"
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

          <!--Capacity-->
          <FormKit
            id="capacity"
            type="number"
            name="capacity"
            label="Capacity"
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
            placeholder="Enter new prerequisite"
            add-text="Add new prerequisite"
            name="prerequisites"
            empty
          />

          <TextMultiple
            title="Volunteer Positions"
            placeholder="Enter new position"
            add-text="Add new position"
            name="volunteerPositions"
            empty
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>
