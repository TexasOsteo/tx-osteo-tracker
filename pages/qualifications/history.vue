<script setup lang="ts">
import _ from 'lodash'

const { data: fetchedQualifications } = await useFetch(
  '/api/qualifications/uploads?processed=true',
)
const userQualifications = computed(() => {
  const quals = fetchedQualifications.value ?? []
  return _.groupBy(quals, (q) => q.userId)
})
</script>

<template>
  <div>
    <h1 class="title font-bold text-5xl text-center py-10">
      Past Qualification Applications
    </h1>
  </div>
  <div>
    <div v-if="Object.keys(userQualifications).length === 0">
      <h1 class="text-center">No qualifications have been processed</h1>
    </div>
    <div
      v-for="(quals, userId) in userQualifications"
      :key="userId"
      class="mx-8 mb-4 p-4 drop-shadow-md rounded-lg bg-gray-100"
    >
      <div class="flex flex-row items-center gap-2">
        <ProfileAvatar :id="userId" />
        <h1 class="text-xl font-bold">
          {{ quals[0].user.name }}
        </h1>
      </div>
      <div class="mt-4">
        <div v-for="(qual, index) in quals" :key="qual.id" class="mb-4">
          <hr class="mb-1 h-px bg-gray-300 border-0" />
          <h1 class="text-lg font-semibold">Application {{ index + 1 }}</h1>
          <p>{{ qual.description }}</p>
          <div v-if="qual.hasFile" class="my-2">
            <a
              :href="`/api/qualifications/uploads/view/${qual.id}`"
              target="_blank"
              class="rounded-lg bg-gray-500 p-1 text-sm text-white hover:bg-gray-700"
            >
              View Attachment
            </a>
          </div>
          <h1 class="mt-4 font-semibold">Applying for:</h1>
          <h2 v-for="q in qual.qualifications" :key="q.id">{{ q.name }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>
