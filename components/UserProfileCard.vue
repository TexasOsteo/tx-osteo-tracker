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
      class="flex flex-wrap items-center justify-center p-4 mb-4 border rounded-md border-slate-300 shadow-lg w-64 h-72"
    >
      <div>
        <div
          class="w-full flex flex-wrap item-center justify-center rounded-full"
        >
          <ProfileAvatar
            :id="id"
            class="w-3/4 h-3/4 rounded-full drop-shadow-sm"
          />
        </div>
        <p class="text-lg pb-4 pt-4">{{ props.name }}</p>
        <p class="text-lg pb-4">{{ props.email }}</p>
      </div>
    </button>
  </div>
</template>
