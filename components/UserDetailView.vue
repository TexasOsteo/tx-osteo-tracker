<template>
  <div v-if="user" class="p-4 bg-white rounded shadow">
    <p class="mb-1">
      <strong>Email:</strong>
      {{ user.email }}
    </p>
    <p class="mb-1">
      <strong>DOB:</strong>
      {{ user.dateOfBirth }}
    </p>
    <p class="mb-1">
      <strong>Languages:</strong>
      {{ user.languages }}
    </p>

    <p class="mt-6 mb-1">
      <strong>Is Admin:</strong>
      <input v-model="localUser.isAdmin" type="checkbox" class="" />
    </p>

    <p class="mb-1">
      <strong>User Notes:</strong>
      {{ user.userNotes }}
    </p>

    <p class="mb-1">
      <strong>Admin Notes:</strong>
      {{
        user.adminNotes && user.adminNotes.length > 0
          ? user.adminNotes.map((noteObj) => noteObj.note).join(', ')
          : 'No notes'
      }}
    </p>

    <div class="flex flex-row">
      <button
        class="mb-2 mt-4 mr-4 py-2 px-4 bg-green-600 text-white rounded"
        @click="saveChanges"
      >
        Save Changes
      </button>
      <button
        class="mb-2 mt-4 py-2 px-4 bg-red-600 text-white rounded"
        @click="deleteUser"
      >
        Delete User
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AdminNotes {
  id: string
  note: string
}

interface User {
  id: string
  name: string
  email: string
  dateOfBirth: string
  languages: string[]
  isAdmin: boolean
  emailPreferences: string[]
  userNotes: string
  adminNotes: AdminNotes[]
}

const props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
})

// Email preference options
const emailPreferenceOptions = [
  'NEW_EVENT',
  'EVENT_REMINDER',
  'EVENT_SIGNUP',
  'NEWSLETTER',
  'REPORT',
  'OTHER',
]

// Vue doesnt allow to directly modify props -> create a copy of the prop
// Otherwise will get error, Unexpected mutation of "user" prop
// Create a local copy of the user prop
const localUser = ref({ ...props.user })

// Watch for changes in the user prop and update the local copy accordingly
watch(
  () => props.user,
  (newUser) => {
    localUser.value = { ...newUser }
  },
  { immediate: true },
)

// Function to handle the form submission
const saveChanges = async () => {
  // Send a PUT request with the local copy of the user data
  // You'll need to replace this with your actual API call
  await fetch(`/api/users/${localUser.value.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(localUser.value),
  })
}
</script>
