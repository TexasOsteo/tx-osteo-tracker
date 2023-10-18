<script setup lang="ts">
const todayString = new Date().toDateString()

const formErrors = ref<string[]>()

async function handleSubmit(fields: any) {
  const { error } = await useFetch('/api/users', {
    method: 'POST',
    body: {
      ...fields,
      numHours: 0,
      isAdmin: false,
      userNotes: [],
      signedUpEvents: [],
      eventHistory: [],
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
  <div class="flex justify-center">
    <div class="w-full max-w-lg h-full mt-10">
      <h1 class="font-bold text-4xl mb-8">Welcome!</h1>
      <FormKit type="form" :errors="formErrors" @submit="handleSubmit">
        <FormKit
          type="text"
          name="name"
          validation="required"
          label="Name"
          placeholder="First and Last Name"
        />

        <FormKit
          type="date"
          label="Date of Birth"
          name="dateOfBirth"
          :validation="`required|date_before:${todayString}`"
        />

        <LanguageSelect />
        <TextMultiple
          title="Qualifications"
          placeholder="Enter qualification description"
          add-text="Add new qualification"
          name="qualifications"
          empty
        />
      </FormKit>
    </div>
  </div>
</template>
