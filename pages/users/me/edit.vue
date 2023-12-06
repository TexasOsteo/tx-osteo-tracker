<script setup lang="ts">
const formErrors = ref<string[]>()
const { data } = await useFetch('/api/auth/me')

async function handleSubmit(fields: any) {
  const { error } = await useFetch(`/api/users/${data.value!.id}`, {
    method: 'PUT',
    body: {
      ...fields,
      qualifications: [],
      languages: [],
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
      class="max-w-screen-lg bg-gray-100 opacity-95 rounded-3xl shadow-xl z-30 p-10 flex justify-center flex-wrap items-center"
    >
      <h1 class="title font-sans font-bold text-5xl text-center mb-10 w-full">
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

          <TextMultiple
            title="Qualifications"
            placeholder="Enter qualification description"
            add-text="Add new qualification"
            name="qualifications"
            outer-class="mb-5 w-4/5"
            empty
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>
