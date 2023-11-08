import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('currentUserStore', () => {
  const currentUser = ref<Awaited<ReturnType<typeof update>>>(null)

  async function update() {
    const { data } = await useFetch('/api/auth/me')
    currentUser.value = data.value
    return data.value
  }

  function getUser() {
    if (currentUser.value !== null) return currentUser.value
    return update()
  }

  return { update, getUser, currentUser }
})
