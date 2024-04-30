<script setup lang="ts">
const formErrors = ref<string[]>()

async function handleSubmit(fields: any) {
  const { error } = await useFetch('/api/users', {
    method: 'POST',
    body: {
      ...fields,
      userNotes: fields.userNotes ?? ' ',
      numHours: 0,
      isAdmin: false,
      signedUpEvents: [],
      eventHistory: [],
      signedUpPositions: [],
      qualificationUploads: [],
      verifiedQualifications: [],
      subscribedEmailCategories: Object.values(UserEmailCategories),
    },
  })

  if (error.value) {
    formErrors.value = [
      'There was an error creating your profile. Do you already have one?',
      error.value.message,
    ]
  } else {
    window.location.replace(new URL('/api/auth/login', window.location.origin))
  }
}
</script>

<template>
  <div class="py-20 flex justify-center flex-wrap items-center">
    <CurveBackground />

    <div
      class="max-w-screen-lg bg-gray-100 opacity-95 rounded-3xl shadow-xl p-10 flex justify-center flex-wrap items-center"
    >
      <h1 class="title font-lexend font-bold text-5xl text-center mb-10 w-full">
        Welcome!
      </h1>
      <FormKit
        type="form"
        :errors="formErrors"
        class-name="items-center"
        @submit="handleSubmit"
      >
        <div class="flex justify-center items-center flex-wrap">
          <FormKit
            id="name"
            type="text"
            name="name"
            label="Name"
            help="Type your first and last name."
            placeholder="First and Last name"
            outer-class="mb-5 w-4/5"
          />

          <FormKit
            id="date_of_birth"
            type="date"
            name="dateOfBirth"
            label="Date of Birth"
            help="Enter your date of birth"
            :validation="`required|date_before`"
            outer-class="mb-5 w-4/5"
            :validation-messages="{
              date_after: 'Enter a date that has occurred',
            }"
          />

          <LanguageSelect />

          <!-- <TextMultiple
            title="Qualifications"
            placeholder="Enter qualification description"
            add-text="Add new qualification"
            name="verifiedQualifications"
            outer-class="mb-5 w-4/5"
            empty
          /> -->

          <FormKit
            id="userNotes"
            type="textarea"
            name="userNotes"
            label="Notes"
            help="Enter any information you want people to know (dietary restrictions, etc)."
            placeholder="Add information here"
            outer-class="mb-5 w-4/5"
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>
