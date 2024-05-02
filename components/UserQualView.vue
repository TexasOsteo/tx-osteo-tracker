<script setup lang="ts">
import _ from 'lodash'

const props = defineProps<{
  user: SerializeObject<FullUser>
}>()

const { data: fetchedQualifications } = await useFetch('/api/qualifications')
const allQualifications = computed(() => fetchedQualifications.value ?? [])

const initialQualifications = props.user.verifiedQualifications.map((q) => q.id)

// New reactive variable to store the updated qualifications
const updatedQualifications = ref(initialQualifications)

// property to track if the user has made changes, enabling the save button
const isChanged = computed(
  () => !_.isEqual(updatedQualifications.value, initialQualifications),
)

const saveChanges = async () => {
  await useFetch(`/api/users/${props.user.id}`, {
    method: 'PUT',
    body: {
      verifiedQualifications: updatedQualifications.value,
    },
  })

  useRouter().go(0)
}
</script>

<template>
  <div v-if="user" class="p-4 bg-white rounded shadow text-left">
    <p class="mb-1">
      <strong>Is Verfied in:</strong>
    </p>
    <ul>
      <li v-for="qual in allQualifications" :key="qual.id" class="mb-1">
        <div class="flex items-center">
          <input
            v-model="updatedQualifications"
            :value="qual.id"
            type="checkbox"
          />
          <span class="ml-2">{{ qual.name }}</span>
        </div>
      </li>
    </ul>
    <button
      class="w-full flex rounded-md shadow-sm px-4 py-2 mt-2 text-[#FDFAF0] font-medium text-center sm:text-sm transition-colors duration-200 items-center justify-center"
      :class="{
        'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-600': isChanged,
        'bg-gray-500 hover:bg-gray-600': !isChanged,
      }"
      :disabled="!isChanged"
      type="button"
      @click="saveChanges"
    >
      Save Changes
    </button>
  </div>
</template>
