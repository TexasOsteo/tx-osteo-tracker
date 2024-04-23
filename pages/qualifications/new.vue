<script setup lang="ts">
const router = useRouter()

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
        <div class="flex justify-center items-center flex-wrap">
          <FormKit
            type="text"
            name="name"
            label="Qualification Name"
            placeholder="Name"
            help="This is the public name for this qualification."
            outer-class="mb-5 w-4/5"
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>
