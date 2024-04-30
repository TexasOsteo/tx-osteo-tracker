<template>
  <div v-if="user" class="p-4 bg-white rounded shadow text-left">
    <p class="mb-1">
      <strong>Is Verfied in:</strong>
    </p>
    <ul>
      <li v-for="qual in availableQuals" :key="qual.id" class="mb-1">
        <div class="flex items-center">
          <input
            type="checkbox"
            class=""
            :checked="
              user.verifiedQualifications.some(
                (verifiedQual) => verifiedQual.id === qual.id,
              )
            "
            @change="handleCheckboxChange(qual, $event)"
          />
          <span class="ml-2">{{ qual.name }}</span>
        </div>
      </li>
    </ul>
    <button
      class="w-full inline-flex rounded-md border border-transparent shadow-sm px-4 py-2 mt-2 text-[#FDFAF0] font-medium sm:w-auto sm:text-sm transition-colors duration-200"
      :class="{
        'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-600': isChanged,
        'bg-gray-500': !isChanged,
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
