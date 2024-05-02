<script setup lang="ts">
import type { AdminNotes } from '@prisma/client'
import ISO6391 from 'iso-639-1'

const props = defineProps<{
  user: SerializeObject<FullUser>
}>()

// Copy default values to new objects to avoid proxying of same object
const updatedUser = ref({ ...props.user })
const updatedAdminNotes = ref<AdminNotes | null>(
  props.user.adminNotes ? { ...props.user.adminNotes } : null,
)

const router = useRouter()

// Function to format the date
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('T')[0].split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const createAdminNote = async () => {
  const { data } = await useFetch('/api/adminNotes', {
    method: 'POST',
    body: {
      note: 'New Note',
      userId: props.user.id,
    },
  })

  if (!data.value) {
    alert('Failed to create admin note')
  } else {
    updatedAdminNotes.value = data.value
  }
}

// Function to handle the form submission
const saveChanges = async () => {
  if (
    updatedAdminNotes.value &&
    updatedAdminNotes.value.note !== props.user.adminNotes?.note
  ) {
    await useFetch(`/api/adminNotes/${updatedAdminNotes.value.id}`, {
      method: 'PUT',
      body: {
        note: updatedAdminNotes.value.note,
      },
    })
  }

  await useFetch(`/api/users/${props.user.id}`, {
    method: 'PUT',
    body: {
      isAdmin: updatedUser.value.isAdmin,
      // ...updatedUser.value,
    },
  })

  // Exit the modal, "refreshing the page"
  router.go(0)
}

const deleteUser = async () => {
  const confirmation = window.confirm(
    'Are you sure you want to delete this user? This action cannot be undone.',
  )

  if (confirmation) {
    await useFetch(`/api/users/${props.user.id}`, {
      method: 'DELETE',
    })

    router.go(0)
  }
}
</script>

<template>
  <div v-if="user" class="p-4 bg-white rounded shadow text-left">
    <div class="sm:grid sm:grid-cols-2 sm:gap-4">
      <!-- Column 1 -->
      <div>
        <p class="mb-1 truncate overflow-hidden">
          <strong>Email:</strong>
          {{ user.email }}
        </p>
        <p class="mb-1">
          <strong>DoB:</strong>
          {{ formatDate(user.dateOfBirth) }}
        </p>
        <p class="mb-1">
          <strong>Hours:</strong>
          {{ user.numHours }}
        </p>

        <div>
          <p class="mb-1">
            <strong>Languages:</strong>
            <span v-if="!user.languages || user.languages.length === 0">
              None
            </span>
          </p>
          <ul v-if="user.languages && user.languages.length > 0">
            <li
              v-for="(lang, index) in user.languages"
              :key="index"
              class="ml-5"
            >
              • {{ ISO6391.getName(lang) }}
            </li>
          </ul>
        </div>

        <p class="mt-6 mb-1 flex items-center">
          <strong>An Admin:</strong>
          <input v-model="updatedUser.isAdmin" type="checkbox" class="ml-3" />
        </p>
        <div v-if="updatedUser.isAdmin !== user.isAdmin" class="text-sm">
          Adding or removing admin status requires the other user to
          re-authenticate before changes are applied.
        </div>
      </div>

      <!-- Column 2 -->
      <div>
        <div class="mb-1">
          <strong>User Notes:</strong>
          <div
            class="w-full p-2 mt-2 border rounded bg-gray-100 whitespace-pre-wrap h-40"
          >
            {{ user.userNotes }}
          </div>
        </div>
        <div class="mb-1">
          <strong>Admin Notes:</strong>
          <div v-if="!updatedAdminNotes" class="mt-2">
            <button
              class="px-4 py-2 text-white bg-[#0DA49B] hover:bg-teal-700 rounded w-full md:w-none"
              @click="createAdminNote"
            >
              Create Note
            </button>
          </div>
          <div v-else>
            <textarea
              v-model="updatedAdminNotes.note"
              class="w-full p-2 mt-2 border rounded bg-gray-100 h-40"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- End of Grid -->

    <div class="flex flex-col mt-4">
      <button
        class="mt-4 mr-4 py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-[#FDFAF0] rounded w-full"
        @click="saveChanges"
      >
        Save Changes
      </button>
      <button
        class="mb-2 mt-2 py-2 px-4 bg-red-500 hover:bg-red-600 text-[#FEF6F6] rounded w-full"
        @click="deleteUser"
      >
        Delete User
      </button>
    </div>
  </div>
</template>
