<script setup lang="ts">
import type { Qualifications } from '@prisma/client'

const router = useRouter()

const { data: fetchedQualifications } = await useFetch('/api/qualifications')
const currentQualifications = ref<Qualifications[]>(
  fetchedQualifications.value ?? [],
)
watch(fetchedQualifications, () => {
  if (fetchedQualifications.value) {
    currentQualifications.value = fetchedQualifications.value.sort((a, b) =>
      a.id.localeCompare(b.id),
    )
  }
})

const formErrors = ref<string[]>()

async function handleSubmit(fields: any) {
  const { error } = await useFetch('/api/qualifications', {
    method: 'POST',
    body: fields,
  })

  if (error.value) {
    formErrors.value = [
      'There was an error creating your qualification',
      error.value.message,
    ]
  } else {
    router.back()
  }
}

async function deleteQualification(id: string) {
  if (!confirm('Are you sure? This action cannot be undone.')) return

  // Preemptively delete qualification from the UI
  const index = currentQualifications.value.findIndex((q) => q.id === id)
  if (index === -1) return
  const deletedQual = currentQualifications.value.splice(index, 1)[0]

  const { error } = await useFetch(`/api/qualifications/${id}`, {
    method: 'DELETE',
  })

  if (error.value) {
    currentQualifications.value.splice(index, 0, deletedQual)
  }
}

async function renameQualification(id: string) {
  const updatedQualification = currentQualifications.value.find(
    (q) => q.id === id,
  )
  if (!updatedQualification) return

  await useFetch(`/api/qualifications/${id}`, {
    method: 'PUT',
    body: {
      name: updatedQualification.name,
    },
  })
}
</script>

<template>
  <div class="py-20 flex justify-center flex-wrap items-center">
    <CurveBackground />

    <div
      class="max-w-screen-lg bg-gray-100 opacity-95 rounded-3xl shadow-xl p-10 flex justify-center flex-wrap items-center"
    >
      <h1 class="title font-lexend font-bold text-5xl text-center mb-10 w-full">
        New Qualification
      </h1>
      <FormKit
        type="form"
        :errors="formErrors"
        class-name="items-center"
        @submit="handleSubmit"
      >
        <FormKit
          type="text"
          name="name"
          label="Qualification Name"
          placeholder="Name"
          help="This is the public name for this qualification."
          outer-class="mb-5 w-full"
        />
      </FormKit>

      <h1
        v-if="currentQualifications.length > 0"
        class="title font-lexend font-bold text-5xl text-center my-10 w-full"
      >
        Manage
      </h1>
      <div class="w-full">
        <div
          v-for="q in currentQualifications"
          :key="q.id"
          class="flex flex-row w-full py-2 border-b-gray-300 border-b-2"
        >
          <input class="w-full p-2" type="text" v-model="q.name" />
          <button
            class="mx-4 w-32 text-white px-3 py-2 rounded-md shadow bg-[#0DA49B] enabled:hover:bg-white enabled:hover:text-black disabled:bg-gray-400"
            @click="renameQualification(q.id)"
          >
            Rename
          </button>
          <button
            class="w-32 text-white px-3 py-2 rounded-md shadow bg-red-700 enabled:hover:bg-white enabled:hover:text-black disabled:bg-gray-400"
            @click="deleteQualification(q.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
