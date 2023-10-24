<!--Form-->
<template>
  <div class="py-20 flex justify-center flex-wrap items-center">
    <CurveBackground />

    <div
      class="w-1/2 bg-gray-100 opacity-95 rounded-3xl shadow-xl z-30 p-10 flex justify-center flex-wrap items-center"
    >
      <h1 class="title font-sans font-bold text-5xl text-center mb-10">
        CREATE EVENT
      </h1>
      <FormKit type="form" class-name="items-center" @submit="submitEvent">
        <!--Title of Event -->
        <div class="flex justify-center items-center flex-wrap">
          <FormKit
            id="title"
            type="text"
            name="name"
            label="Name"
            help="Type event name here."
            placeholder="Event Name"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
          />

          <!--Name of Organizer-->
          <FormKit
            id="organizer"
            type="text"
            name="organizer"
            label="Organizer"
            help="Type organization name here."
            placeholder="Organization Name"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
          />

          <!--Location-->
          <FormKit
            id="loc"
            type="text"
            name="location"
            label="Location"
            help="Enter the street address followed by the city, state, and zipcode."
            placeholder="3333 Bones St, Austin, TX 77777"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
          />

          <!--Date-->
          <FormKit
            id="event_date"
            type="datetime-local"
            name="dateAndTime"
            label="Date and Time"
            help="Enter the date and time of the event"
            validation="required|date_after"
            validation-visibility="live"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
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
            value="2"
            step="0.5"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
          />

          <!--Thumbnail-->
          <FormKit
            id="thumbnail"
            type="file"
            label="Thumbnail"
            accept=".png,.pdf,.jpeg"
            help="Upload a thumbnail for the event listing. Accepted formats: .png, .pdf, .jpeg."
            multiple="false"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
          />

          <div></div>

          <!--Phone Number-->
          <FormKit
            id="phone_number"
            type="text"
            name="phoneNumber"
            label="Organization Phone Number"
            help="Type the phone number of the event organizer"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
            placeholder="(+X) XXX-XXX-XXXX"
          />

          <!--Email-->
          <FormKit
            id="email"
            type="text"
            name="email"
            label="Organization Email"
            help="Type the email of the event organizer"
            placeholder="emailexample@domain.com"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
          />

          <!--Capacity-->
          <FormKit
            id="capacity"
            type="number"
            name="capacity"
            label="Capacity"
            help="Type the maximum capacity of volunteers for this event"
            step="1"
            inner-class=""
            input-class=""
            outer-class="mb-5 w-4/5"
            help-class=""
            placeholder="5"
          />

          <LanguageSelect />
        </div>
      </FormKit>
    </div>
  </div>
</template>
