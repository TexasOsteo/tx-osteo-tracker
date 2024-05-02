<script setup lang="ts">
const { data: users } = await useFetch('/api/users')
const selectedUserId = ref<string | null>(null)

// Search based on name or email, fuzzy
const search = ref('')

const filteredUsers = computed(() => {
  // Make copy to sort in place
  const usersCopy = [...(users.value ?? [])]
  usersCopy.sort((a, b) => (a.name + a.email).localeCompare(b.name + b.email))

  if (!search.value) {
    return usersCopy
  }
  const lowerCaseSearch = search.value.toLowerCase()
  return usersCopy.filter(
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
        class="w-1/3 p-2 mb-4 text-center hidden sm:block bg-slate-200 m-2 rounded-lg"
      />

      <input
        v-model="search"
        type="text"
        placeholder="Search"
        class="w-1/3 p-2 mb-4 text-center block sm:hidden bg-slate-200 m-2 rounded-lg"
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
