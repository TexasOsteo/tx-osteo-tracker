<template>
  <div v-if="user" class="p-4 bg-white rounded shadow text-left">
    <div class="sm:grid sm:grid-cols-2 sm:gap-4">

      <!-- Column 1 -->
      <div>
        <p class="mb-1">
          <strong>Email:</strong>
          {{ user.email }}
        </p>
        <p class="mb-1">
          <strong>DoB:</strong>
          {{ formatDate(user.dateOfBirth) }}
        </p>

        <div>
          <p class="mb-1">
            <strong>Languages:</strong>
            <span v-if="!user.languages || user.languages.length === 0">
              None
            </span>
          </p>
          <ul v-if="user.languages && user.languages.length > 0">
            <li v-for="(lang, index) in user.languages" :key="index" class="ml-5">
              • {{ ISO6391.getName(lang) }}
            </li>
            </ul>
        </div>
  
        <p class="mt-6 mb-1 flex items-center">
          <strong>An Admin:</strong>
          <input v-model="localUser.isAdmin" type="checkbox" class="ml-3" />
        </p>
  
        <p class="mb-1">
          <div class="flex items-center">
            <strong>Email Preferences</strong>
            <button
            class="ml-2 pt-1"
            @click="showEmailPreferences = !showEmailPreferences"
            >
              <img v-if="showEmailPreferences" src="/icon-park_up.jpg" class="w-5 h-5" />
              <img v-else src="/icon-park_down.jpg" class="w-5 h-5" />
            </button>
          </div>
        </p>
  
        <div v-if="showEmailPreferences" class="mt-2">
          <div v-for="option in emailPreferenceOptions" :key="option" class="mb-1">
            <input
              v-model="localUser.subscribedEmailCategories"
              type="checkbox"
              :value="option"
              class="mr-2"
            />
            {{ option }}
          </div>
        </div>
  
      </div>
  
      <!-- Column 2 -->
      <div>
        <p class="mb-1">
          <strong>User Notes:</strong>
          <div
          class="w-full p-2 mt-2 border rounded bg-gray-100 whitespace-pre-wrap h-40"
          >
            {{ localUser.userNotes }}
          </div>
        </p>
  
        <p class="mb-1">
          <strong>Admin Notes:</strong>
            <div v-if="!localUser.adminNotes" class="mt-2">
              <button
              class="px-4 py-2 text-white bg-[#0DA49B] rounded"
              @click="createAdminNote"
              >
                Create Note
              </button>
            </div>
            <div v-else>
              <textarea
              v-model="localUser.adminNotes.note"
              class="w-full p-2 mt-2 border rounded bg-gray-100 h-40"
              ></textarea>
            </div>
        </p>
      </div>
    </div> <!-- End of Grid -->

    <div class="flex flex-col mt-4">
      <button
        class="mt-4 mr-4 py-2 px-4 bg-yellow-500 text-[#FDFAF0] rounded w-full"
        @click="saveChanges"
      >
        Save Changes
      </button>
      <button
        class="mb-2 mt-2 py-2 px-4 bg-red-500 text-[#FEF6F6] rounded w-full"
        @click="deleteUser"
      >
        Delete User
      </button>
    </div>
  </div>

</template>

<script setup lang="ts">
import ISO6391 from 'iso-639-1'

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
  subscribedEmailCategories: string[]
  userNotes: string
  adminNotes: AdminNotes | null
}

const props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
})

// Function to format the date
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('T')[0].split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Display names for languages: from "en" to English, not supported on Internet Explorer
const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});

const getLanguageName = (code: string) => {
  return languageNames.of(code);
}

// Email preference options
const emailPreferenceOptions = [
  'NEW_EVENT',
  'EVENT_REMINDER',
  'EVENT_SIGNUP',
  'NEWSLETTER',
  'REPORT',
  'OTHER',
]

// State for showing/hiding the email preferences
const showEmailPreferences = ref(true)

// Vue doesnt allow to directly modify props -> create a copy of the prop
// Otherwise will get error, Unexpected mutation of "user" prop
// Create a local copy of the user prop
const localUser = ref({
  ...props.user,
  adminNotes: props.user.adminNotes ? { ...props.user.adminNotes } : null,
})

// Watch for changes in the user prop and update the local copy accordingly
watch(
  () => props.user,
  (newUser) => {
    localUser.value = {
      ...newUser,
      adminNotes: newUser.adminNotes ? { ...newUser.adminNotes } : null,
    }
  },
  { immediate: true },
)

const createAdminNote = async () => {
  const requestBody = {
    note: 'New note',
    userId: localUser.value.id,
  }

  const response = await fetch('/api/adminNotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error('Failed to create admin note')
  }

  const adminNote = await response.json()
  localUser.value.adminNotes = adminNote
}

// Function to handle the form submission
const saveChanges = async () => {

  // Dont save the placeholder text for new adminNote
  const noteContent = localUser.value.adminNotes?.note === 'New note'
    ? ' '
    : localUser.value.adminNotes?.note

  // If there is an "true" note
  if (localUser.value.adminNotes) {
    await fetch(`/api/adminNotes/${localUser.value.adminNotes.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note: noteContent,
        userId: localUser.value.id,
      }),
    })
  }


  // Send a PUT request with the local copy of the user data
  await fetch(`/api/users/${localUser.value.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({...localUser.value,
      adminNotes: undefined,
      signedUpPositions: undefined,
      signedUpEvents: undefined,
      verifiedQualifications: undefined,
      qualificationUploads: undefined,
    }),
  })
}

const deleteUser = async () => {
  const confirmation = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
  
  if (confirmation) {
    const response = await fetch(`/api/users/${localUser.value.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    // Exit the modal, "refreshing the page"
    const router = useRouter()
    router.go(0)
  }
}
</script>
