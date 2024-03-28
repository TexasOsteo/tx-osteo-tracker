<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { data: fetchData } = await useFetch('/api/users/me')

const route = useRoute()
const category = route.params.category as string

enum StatusStates {
  Fetching,
  Error,
  Success,
  Unauthenticated,
  UnknownCategory,
}

const currentStatus = ref(StatusStates.Fetching)

async function unsubscribe() {
  const userCats = Object.values(UserEmailCategories) as string[]
  const adminCats = Object.values(AdminEmailCategories) as string[]
  if (!userCats.concat(adminCats).includes(category)) {
    currentStatus.value = StatusStates.UnknownCategory
    return
  }

  if (
    !fetchData.value ||
    !Array.isArray(fetchData.value.subscribedEmailCategories)
  ) {
    currentStatus.value = StatusStates.Unauthenticated
    return
  }

  const currentCategories = fetchData.value.subscribedEmailCategories

  const { error } = await useFetch(`/api/users/${fetchData.value.id}`, {
    method: 'PUT',
    body: {
      subscribedEmailCategories: currentCategories.filter(
        (c) => c !== category,
      ),
    },
  })

  if (error.value) {
    currentStatus.value = StatusStates.Error
  } else {
    currentStatus.value = StatusStates.Success
  }
}

// Sometimes fetchData will be empty initially, so this waits if necessary
if (fetchData.value) {
  unsubscribe()
} else {
  watch(fetchData, () => unsubscribe())
}
</script>

<template>
  <div class="text-center mt-10">
    <h1 v-if="currentStatus == StatusStates.Fetching" class="text-3xl">
      Unsubscribing...
    </h1>
    <h1 v-if="currentStatus == StatusStates.Error" class="text-3xl">
      There was an error unsubscribing. Please try again later.
    </h1>
    <h1 v-if="currentStatus == StatusStates.Success" class="text-3xl">
      You have successfully unsubscribed from the {{ category }} category.
    </h1>
    <h1 v-if="currentStatus == StatusStates.Unauthenticated" class="text-3xl">
      You must be signed in to unsubscribe. Please sign-in, or go to your user
      settings page.
    </h1>
    <h1 v-if="currentStatus == StatusStates.UnknownCategory" class="text-3xl">
      The category you are trying to unsubscribe from does not exist.
    </h1>
  </div>
  <div class="flex justify-center mt-10">
    <NuxtLink
      class="bg-gray-100 hover:bg-gray-200 p-3 rounded-md flex items-center drop-shadow-sm"
      to="/"
    >
      <Icon name="mdi:home" />
      <span class="hidden lg:block">Home</span>
    </NuxtLink>
  </div>
</template>
