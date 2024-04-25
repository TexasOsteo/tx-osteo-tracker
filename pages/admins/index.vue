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

const showDetail = (id: string) => {
  selectedUserId.value = id
}

const closeDetail = () => {
  selectedUserId.value = null
}
</script>

<template>
  <div>
    <h1 class="title font-bold text-5xl text-center py-10">
      Volunteer Page - Utility
    </h1>
    <UserProfileCard
      v-for="user in users"
      :id="user.id"
      :key="user.id"
      :name="user.name"
      :email="user.email"
      @show-detail="showDetail"
    />
    <UserProfileDetail
      v-if="selectedUserId"
      :id="selectedUserId"
      @close="closeDetail"
    />
  </div>
</template>
