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

const imageValue = ref<string>()
const modalOpen = ref<boolean>(false)
const images = ref<BlobInfo[] | null>(null)
const uploadedImage = ref<File | null>(null)
const imageSelectForm = ref<HTMLFormElement>()
const errorText = ref<string | null>(null)

// Detect when the modal opens and request images
watch(modalOpen, () => {
  if (modalOpen.value && images.value === null) {
    images.value = [] // Make non-null so no other promises are created
    getImages()
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
  body.set('file', uploadedImage.value)

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
  imageValue.value = data.value.url
  modalOpen.value = false
  uploadedImage.value = null
}

function confirm() {
  if (imageSelectForm.value) {
    const data = new FormData(imageSelectForm.value)
    const selectedImage = data.get('image')
    if (selectedImage) {
      imageValue.value = selectedImage as string
    }
  }
  modalOpen.value = false
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
    <h1>Select an Image</h1>
    <form
      v-if="images && images.length > 0"
      :ref="(elem) => (imageSelectForm = elem as HTMLFormElement)"
      class="p-2 grid grid-cols-3 gap-4"
    >
      <label v-for="image in images" :key="image.name" :for="image.name">
        <input
          :id="image.name"
          :key="image.name"
          class="peer invisible opacity-0 w-0 h-0"
          :value="image.url"
          type="radio"
          name="image"
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
      @input="
        (f: FormKitFile[]) => (uploadedImage = (f ?? [])[0]?.file ?? null)
      "
    />
    <div class="flex w-full justify-end gap-1">
      <button
        v-if="uploadedImage"
        class="block text-white bg-green-700 disabled:bg-gray-300 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        @click="() => uploadImage()"
      >
        Upload
      </button>
      <button
        class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        @click="() => confirm()"
      >
        Confirm
      </button>
    </div>
    <p v-if="errorText" class="text-red-500">{{ errorText }}</p>
  </VueFinalModal>
</template>
