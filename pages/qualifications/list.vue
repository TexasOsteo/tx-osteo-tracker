<script setup lang="ts">
import _ from 'lodash'

const { data: fetchedQualifications } = await useFetch(
  '/api/qualifications/uploads?processed=false',
)
const userQualifications = computed(() => {
  const quals = fetchedQualifications.value ?? []
  return _.groupBy(quals, (q) => q.userId)
})

async function updateStatus(qualId: string, approved: boolean) {
  // Preemptively remove qualification and restore it later if there is an error
  const oldQuals = Array.from(fetchedQualifications.value ?? [])
  fetchedQualifications.value = (fetchedQualifications.value ?? []).filter(
    (q) => q.id !== qualId,
  )

  const { data, error } = await useFetch(
    `/api/qualifications/uploads/status/${qualId}`,
    {
      method: 'PUT',
      body: {
        approved,
      },
    },
  )
  if (error.value || !data.value) {
    alert('Failed to update qualification application.')
    fetchedQualifications.value = oldQuals
  }
}
</script>

<template>
  <div>
    <h1 class="title font-bold text-5xl text-center py-10">
      Unverified Qualifications
    </h1>
  </div>
  <div>
    <div v-if="Object.keys(userQualifications).length === 0">
      <h1 class="text-center">There are no new qualifications to check!</h1>
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
          <div class="mt-4 flex flex-row gap-2">
            <button
              class="inline-block text-white bg-green-700 disabled:bg-gray-300 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2 text-center"
              @click="() => updateStatus(qual.id, true)"
            >
              Approve
            </button>
            <button
              class="block text-white bg-red-700 disabled:bg-gray-300 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center"
              @click="() => updateStatus(qual.id, false)"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
