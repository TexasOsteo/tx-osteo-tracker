<template>
  <div v-if="user" class="p-4 bg-white rounded shadow">
    <p class="mb-1">
      <strong>Is Verfied in:</strong>
    </p>
    <ul>
      <li v-for="qual in availableQuals" :key="qual.id" class="mb-2">
        <div class="flex items-center">
          <input
            type="checkbox"
            :checked="
              user.verifiedQualifications.some(
                (verifiedQual) => verifiedQual.id === qual.id,
              )
            "
            @change="handleCheckboxChange(qual, $event)"
          />
          <span class="mr-2">{{ qual.name }}</span>
        </div>
      </li>
    </ul>
    <button
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium sm:ml-3 sm:w-auto sm:text-sm"
      :class="{
        'bg-green-600 hover:bg-green-700 focus:ring-green-500': isChanged,
        'bg-gray-400': !isChanged,
      }"
      :disabled="!isChanged"
      type="button"
      @click="saveChanges"
    >
      Save Changes
    </button>
    <!-- <p>{{ updatedQualifications }}</p> -->
  </div>
</template>

<script setup lang="ts">
interface Qualification {
  id: string
  name: string
}

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  verifiedQualifications: Qualification[]
  // add other properties as needed
}

const props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
})

const availableQuals = ref<Qualification[]>([])
onMounted(async () => {
  const response = await fetch(`/api/qualifications/`)
  if (!response.ok) {
    throw new Error('Failed to fetch user details')
  }
  availableQuals.value = await response.json()
})

// property to track if the user has made changes, enabling the save button
const isChanged = ref(false)

watch(
  () => props.user?.verifiedQualifications,
  () => {
    isChanged.value = true
  },
  { deep: true },
)

// New reactive variable to store the updated qualifications
const updatedQualifications = ref<string[]>([])

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      updatedQualifications.value = newUser.verifiedQualifications.map(
        (q) => q.id,
      )
    }
  },
  { immediate: true },
)

// Function to handle checkbox change
const handleCheckboxChange = (qual: Qualification, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  if (isChecked) {
    updatedQualifications.value.push(qual.id)
  } else {
    updatedQualifications.value = updatedQualifications.value.filter(
      (id) => id !== qual.id,
    )
  }
  isChanged.value = true
}

// Function to save changes
const saveChanges = async () => {
  const response = await fetch(`/api/users/${props.user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      verifiedQualifications: updatedQualifications.value,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to update qualifications')
  }
  // Handle successful update...
  // For example, you could reset isChanged and reload the user data
  isChanged.value = false
}
</script>
