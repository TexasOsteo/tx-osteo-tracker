<script setup lang="ts">
defineEmits(['close-modal'])
defineProps<{
  modalActive: boolean
  id: string
}>()
</script>
<template>
  <Teleport to="body">
    <Transition name="modal-outer">
      <div
        v-show="modalActive"
        v-if="modalActive"
        id="eventModal"
        data-modal-backdrop="static"
        class="fixed z-10 inset-0 overflow-y-auto overflow-x-auto"
        tabindex="-1"
        aria-hidden="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <Transition name="modal-inner">
            <div
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <slot></slot>

              <div
                class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
              >
                <EventRegisterButton :id="id" />
                <button
                  id="closeModal"
                  data-modal-hide="static-modal"
                  type="button"
                  class="text-gray-500 bg-white hover:bg-white-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md border border-gray-200 text-md  px-5 py-3 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  @click="$emit('close-modal')"
                >
                  Back
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}

.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
  opacity: 0;
  transform: scale(1);
}

.modal-inner-leave-to {
  transform: scale(1);
}
</style>
