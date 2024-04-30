<script setup lang="ts">
interface User {
  id: string
  name: string
  email: string
  // add other properties as needed
}

const users = ref<User[]>([])
const selectedUserId = ref<string | null>(null)

onMounted(async () => {
  const response = await fetch(`/api/users/`)
  if (!response.ok) {
    throw new Error('Failed to fetch user details')
  }
  users.value = await response.json()
})

// Search based on name or email, fuzzy
const search = ref('')

const filteredUsers = computed(() => {
  if (!search.value) {
    return users.value
  }
  const lowerCaseSearch = search.value.toLowerCase()
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(lowerCaseSearch) ||
      user.email.toLowerCase().includes(lowerCaseSearch),
  )
})

const showDetail = (id: string) => {
  selectedUserId.value = id
}

const closeDetail = () => {
  selectedUserId.value = null
}
</script>

<template>
  <div>
    <h1 class="title font-bold text-4xl md:text-5xl text-center py-10">
      Volunteer Page - Utility
    </h1>
    <!-- Search Bar-->
    <div class="flex justify-center">
      <input
        v-model="search"
        type="text"
        placeholder="Search for a user by name or email"
        class="w-1/3 p-2 mb-4 text-center border-b border-gray-400 hidden sm:block"
      />

      <input
        v-model="search"
        type="text"
        placeholder="Search"
        class="w-1/3 p-2 mb-4 text-center border-b border-gray-400 block sm:hidden"
      />
    </div>
    <!-- User Profile Cards -->
    <div class="flex flex-wrap gap-4 w-full items-center justify-center">
      <UserProfileCard
        v-for="user in filteredUsers"
        :id="user.id"
        :key="user.id"
        :name="user.name"
        :email="user.email"
        @show-detail="showDetail"
      />
    </div>
    <UserProfileDetail
      v-if="selectedUserId"
      :id="selectedUserId"
      @close="closeDetail"
    />
  </div>
</template>
