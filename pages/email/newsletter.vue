<script setup lang="ts">
const formErrors = ref<string[]>()

async function handleSubmit(fields: any) {
  const { error } = await useFetch('/api/email/newsletter', {
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
      class="max-w-screen-lg bg-white bg-opacity-95 md:bg-opacity-80 shadow-2xl backdrop-blur-none md:backdrop-blur-md rounded-3xl shadow-xl p-10 flex justify-center flex-wrap items-center"
    >
      <h1 class="title font-sans font-bold text-5xl text-center mb-10">
        CREATE WEEKLY DIGEST
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
            label="Digest Title"
            help="Type Digest Title Here"
            placeholder="Digest Title"
            outer-class="mb-5 w-4/5"
          />

          <!--Thumbnail-->
          <ImageSelect
            type="thumbnail"
            name="image"
            label="Attach Any Supportive Images"
          />

          <!--Description-->
          <FormKit
            id="description"
            type="textarea"
            name="content"
            label="Description"
            help="Type a description of the Digest"
            outer-class="mb-5 w-4/5"
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>
