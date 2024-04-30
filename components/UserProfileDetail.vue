<template>
  <div v-if="user" class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >
        &#8203;
      </span>
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <button
          class="absolute top-0 right-0 sm:top-2 sm:right-1 m-4 w-6 h-6"
          type="button"
          @click="closeDetail"
        >
          <img src="/icon-park_x.jpg" alt="Close" />
        </button>

        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ user.name }}
              </h3>

              <div class="mt-2">
                <div class="border-b border-gray-200">
                  <nav class="-mb-px flex" aria-label="Tabs">
                    <button
                      v-for="(tab, index) in tabs"
                      :key="index"
                      :class="[
                        'px-3 py-2 font-medium text-sm rounded-md',
                        activeTab === index
                          ? 'text-[#0DA49B] border-[#0DA49B]'
                          : 'text-gray-500 hover:text-gray-700',
                      ]"
                      @click="activeTab = index"
                    >
                      {{ tab.name }}
                    </button>
                  </nav>
                </div>
                <div
                  v-for="(tab, index) in tabs"
                  v-show="activeTab === index"
                  :key="index"
                >
                  <component :is="tab.component" :user="user" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserDetailView from './UserDetailView.vue'
import UserQualView from './UserQualView.vue'
import UserEventView from './UserEventView.vue'

interface User {
  id: string
  name: string
  email: string
  // add other properties as needed
}

const props = defineProps({
  id: String,
})

const emit = defineEmits(['close'])

const user = ref<User | null>(null)
const activeTab = ref(0)
const tabs = ref([
  { name: 'Profile', component: UserDetailView },
  { name: 'Qualifications', component: UserQualView },
  { name: 'Register', component: UserEventView },
  // add more tabs as needed
])

onMounted(async () => {
  const response = await fetch(`/api/users/${props.id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user details')
  }
  user.value = await response.json()
})

const closeDetail = () => {
  emit('close')
}
</script>
