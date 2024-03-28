<script setup lang="ts">
/**
 * This component allows for existing images to be selected and or new ones to be uploaded
 */
import { VueFinalModal } from 'vue-final-modal'
import type { BlobInfo } from '~/utils/types'

type FormKitFile = {
  name: string
  file: File
}

const props = defineProps<{
  /**
   * Image type, such as 'thumbnail'
   */
  type: string
  /**
   * Formkit name
   */
  name: string
  /**
   * Formkit label
   */
  label: string
  /**
   * Formkit validation
   */
  validation?: string
}>()

const imageValue = ref<string>() // Uses undefined instead of null for FormKit
const modalOpen = ref<boolean>(false)
const images = ref<BlobInfo[] | null>(null)
const uploadedImage = ref<FormKitFile | null>(null)
const errorText = ref<string | null>(null)

watch(modalOpen, () => {
  // Detect when the modal opens and request images
  if (modalOpen.value && images.value === null) {
    images.value = [] // Make non-null so no other promises are created
    getImages()
  }

  if (!modalOpen.value) {
    // Reset error text
    errorText.value = null
  }
})

async function getImages() {
  const { data } = await useFetch(`/api/images?type=${props.type}`)
  images.value = data.value ?? []
}

async function uploadImage() {
  if (!uploadedImage.value) return

  const body = new FormData()
  body.set('type', props.type)
  body.set('file', uploadedImage.value.file)

  const { data, error } = await useFetch(`/api/images?type=${props.type}`, {
    method: 'POST',
    body,
  })
  if (!data.value) {
    errorText.value =
      error.value?.message ?? 'Could not upload image for unknown reason.'
    return
  }

  images.value = null // Reset images because the array is now outdated
  modalOpen.value = false
  imageValue.value = data.value.url
  uploadedImage.value = null
}

async function deleteImage() {
  if (!imageValue.value || !images.value) return

  const confirmation = confirm(
    'Are you sure? The image will be permanently deleted for the entire website.',
  )
  if (!confirmation) return

  const imageBlob = images.value.find((b) => b.url === imageValue.value)
  if (!imageBlob) return

  const { data, error } = await useFetch(`/api/images/${imageBlob.name}`, {
    method: 'DELETE',
  })

  if (!data.value) {
    errorText.value =
      error.value?.message ?? 'Could not delete image for unknown reason.'
    return
  }

  // Remove deleted image
  images.value = images.value.filter((b) => b.name !== imageBlob.name)
  imageValue.value = undefined
}
</script>

<template>
  <div
    class="flex relative flex-wrap flex-col justify-center items-center w-4/5"
  >
    <div className="w-full flex flex-row justify-between">
      <div>
        <h1 class="block mb-1 font-bold text-left">{{ label }}</h1>
        <button
          class="block bg-transparent ring-1 ring-gray-400 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-gray-600"
          type="button"
          @click="() => (modalOpen = true)"
        >
          Select Image
        </button>
      </div>
      <div class="h-32 max-w-[50%]">
        <img
          v-if="imageValue"
          class="h-full w-auto object-cover align-middle cursor-pointer"
          :src="imageValue"
          @click="() => (modalOpen = true)"
        />
      </div>
      <FormKit
        v-model="imageValue"
        :name="name"
        type="meta"
        :validation="validation"
      />
    </div>
  </div>

  <VueFinalModal
    v-model="modalOpen"
    class="flex justify-center items-center"
    content-class="flex flex-col lg:6/12 sm:w-8/12 w-full max-h-[90vh] mx-4 p-4 bg-white border rounded-lg space-y-2"
  >
    <h1 class="font-bold">Select an Image</h1>
    <form
      v-if="images && images.length > 0"
      class="p-2 grid grid-cols-3 gap-2 h-max overflow-y-auto"
    >
      <label v-for="image in images" :key="image.name" :for="image.name">
        <input
          :id="image.name"
          :key="image.name"
          v-model="imageValue"
          class="peer invisible opacity-0 w-0 h-0"
          :value="image.url"
          type="radio"
        />
        <img
          class="object-cover max-w-full h-auto align-middle cursor-pointer peer-checked:outline-8 outline-0 outline-double outline-black"
          :src="image.url"
        />
      </label>
    </form>
    <br />
    <FormKit
      type="file"
      label="New Image"
      accept=".png,.jpg,.jpeg,.gif,.webp"
      help="Upload a new image"
      @input="(f: FormKitFile[]) => (uploadedImage = f[0] ?? null)"
    />
    <div class="flex w-full justify-end gap-1">
      <button
        v-if="imageValue"
        class="block text-white bg-red-700 disabled:bg-gray-300 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        @click="() => deleteImage()"
      >
        Delete Selected
      </button>
      <button
        v-if="imageValue && !validation?.includes('required')"
        class="block text-white bg-gray-400 disabled:bg-gray-300 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        @click="() => (imageValue = undefined)"
      >
        Clear Selected
      </button>
      <button
        v-if="uploadedImage"
        class="inline-block text-white bg-green-700 disabled:bg-gray-300 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        @click="() => uploadImage()"
      >
        Upload
      </button>
      <button
        class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        @click="() => (modalOpen = false)"
      >
        Confirm
      </button>
    </div>
    <p v-if="errorText" class="text-red-500">{{ errorText }}</p>
  </VueFinalModal>
</template>
