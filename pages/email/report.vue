<script setup lang="ts">
const formErrors = ref<string[]>()

async function handleSubmit(fields: any) {
  const { error } = await useFetch('/api/email/report', {
    method: 'POST',
    body: fields,
  })

  if (error.value) {
    formErrors.value = [
      'There was an error submitting this form.',
      error.value.message,
    ]
  } else {
    const router = useRouter()
    router.go(-1)
  }
}
</script>

<!--Form-->
<template>
  <div class="py-20 flex justify-center flex-wrap items-center">
    <CurveBackground />

    <div
      class="max-w-screen-lg bg-gray-100 opacity-95 rounded-3xl shadow-xl z-30 p-10 flex justify-center flex-wrap items-center"
    >
      <h1 class="title font-sans font-bold text-5xl text-center mb-10">
        REPORT VOLUNTEER
      </h1>
      <FormKit
        type="form"
        :errors="formErrors"
        class-name="items-center"
        @submit="handleSubmit"
      >
        <!--Title of Event -->
        <div class="flex justify-center items-center flex-wrap">
          <FormKit
            id="title"
            type="text"
            name="title"
            label="Event Name"
            help="Type event name where the incident occured here."
            placeholder="Event Name"
            outer-class="mb-5 w-4/5"
          />

          <!--Description-->
          <FormKit
            id="description"
            type="textarea"
            name="content"
            label="Description"
            help="Type a description of the occurence"
            outer-class="mb-5 w-4/5"
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>
