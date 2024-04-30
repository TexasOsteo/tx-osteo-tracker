<script setup lang="ts">
const props = defineProps({
  id: String,
  name: String,
  email: String,
})

const emit = defineEmits(['showDetail'])

const showModal = () => {
  emit('showDetail', props.id)
}
</script>

<template>
  <div>
    <button
      @click="showModal"
      class="flex flex-wrap items-center justify-center p-4 mb-4 rounded-md shadow-lg w-64 h-72"
    >
      <div class="w-full">
        <div
          class="w-full flex flex-wrap item-center justify-center rounded-full"
        >
          <ProfileAvatar
            :id="id"
            class="w-1/2 h-1/2 rounded-full drop-shadow-sm"
          />
        </div>
        <p class="text-lg pb-4 pt-4 text-clip overflow-hidden">
          {{ props.name }}
        </p>
        <p class="text-lg pb-4 truncate overflow-hidden">{{ props.email }}</p>
      </div>
    </button>
  </div>
</template>
