<script setup lang="ts">
const { data: fetchedQualifications } = await useFetch('/api/qualifications')
const { data: user } = await useFetch('/api/users/me')

const qualifications = computed(() => {
  let quals = fetchedQualifications.value ?? []
  if (user.value) {
    // Remove qualifications the user already has
    quals = quals.filter(
      (q) => !user.value!.verifiedQualifications.some((v) => v.id === q.id),
    )
  }
  return Object.fromEntries(quals.map((q) => [q.id, q.name]))
})

const defaultQualification = computed(
  () => Object.keys(qualifications.value)[0] ?? '',
)

const router = useRouter()

const formErrors = ref<string[]>()

async function handleSubmit(fields: any) {
  const data = new FormData()
  data.set('qualifications', JSON.stringify(fields.qualifications))
  data.set('description', fields.description)
  const file =
    Array.isArray(fields.file) && fields.file.length > 0
      ? await fileToBase64(fields.file[0].file)
      : undefined

  const { error } = await useFetch('/api/qualifications/uploads', {
    method: 'POST',
    body: {
      qualifications: fields.qualifications,
      description: fields.description,
      file,
    },
  })

  if (error.value) {
    formErrors.value = [
      'There was an error creating your application',
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
        New Application
      </h1>
      <FormKit
        type="form"
        :errors="formErrors"
        class-name="items-center"
        :disabled="Object.keys(qualifications).length === 0"
        @submit="handleSubmit"
      >
        <div class="flex justify-center items-center flex-wrap">
          <SelectMultiple
            v-if="Object.keys(qualifications).length > 0"
            :options="qualifications"
            :empty="true"
            title="Qualification To Apply For"
            name="qualifications"
            add-text="Apply to another qualification"
            validation="noDuplicates|required"
            :default-value="defaultQualification"
          />
          <h1 v-if="Object.keys(qualifications).length === 0">
            There are no new qualifications for you to apply for.
          </h1>
          <FormKit
            type="textarea"
            name="description"
            label="Description"
            placeholder="Explain why you should have these qualifications."
            help="This description will be used by staff to approve your qualifications."
            outer-class="mb-5 w-4/5"
          />

          <FormKit
            type="file"
            label="Add Attachment"
            name="file"
            accept=".png,.jpg,.jpeg,.gif,.webp, .pdf, .txt"
            help="Upload a new file"
            outer-class="mb-5 w-4/5"
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>
