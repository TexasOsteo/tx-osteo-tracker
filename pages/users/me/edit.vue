<script setup lang="ts">
import type { SerializeObject, UserWithEvents } from '~/utils/types'

type FormKitUserData = Partial<SerializeObject<UserWithEvents>>

const formErrors = ref<string[]>()
const { data: fetchData } = await useFetch('/api/users/me')

// Needed for email input, but this can't be a part of the form body
const isAdmin = ref<boolean>(false)

// Parse the response from the server into something FormKit understands
function toFormData(
  data: SerializeObject<UserWithEvents> | null,
): FormKitUserData {
  if (!data) return {}
  isAdmin.value = data.isAdmin
  return {
    // Formkit needs date in this format:
    dateOfBirth: data.dateOfBirth.split('T')[0],
    id: data.id,
    name: data.name,
    email: data.email,
    languages: data.languages,
    subscribedEmailCategories: data.subscribedEmailCategories,
    userNotes: data.userNotes,
  }
}

// Watch for updates from the server and update the formkit ref if needed
const formData = ref<FormKitUserData>(toFormData(fetchData.value))
watch(fetchData, (value) => (formData.value = toFormData(value)))

async function handleSubmit(fields: any) {
  const id = fetchData.value?.id
  if (!id) return

  const { error } = await useFetch(`/api/users/${id}`, {
    method: 'PUT',
    body: fields,
  })

  if (error.value) {
    formErrors.value = [
      'There was an error updating your profile.',
      error.value.message,
    ]
  } else {
    const router = useRouter()
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
      <h1 class="title font-sans font-bold text-5xl text-center mb-10 w-full">
        Edit Settings
      </h1>
      <FormKit
        v-model="formData"
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

          <EmailCategoryInput :is-admin="isAdmin" />
        </div>
      </FormKit>
    </div>
  </div>
</template>
