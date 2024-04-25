<!--
  Return a list of volunteer of an event
-->
<script setup lang="ts">
const isAdmin = isSignedInUserAdmin()
const volunteerList = ref<{ name: string; email: string; id: string }[]>([])
const route = useRoute()

if (isAdmin) {
  try {
    const { data } = await useFetch(`/api/events/${route.params.id}`)
    volunteerList.value =
      data.value?.signedUpUsers.map((user) => ({
        name: user.name,
        email: user.email,
        id: user.id,
      })) || []
  } catch (error) {
    console.error('Error fetching event data:', error)
  }
}
// return a list of volunteers sorted by name alphabetically
volunteerList.value.sort((a, b) => a.name.localeCompare(b.name))
// confirmation modal
const isConfirmationModalOpen = ref(false)
const userIdToRemove = ref(null)
const removeUser = (userId: any) => {
  isConfirmationModalOpen.value = true
  userIdToRemove.value = userId
}
// cancel button
const cancelRemoval = () => {
  isConfirmationModalOpen.value = false
  userIdToRemove.value = null
}
// volunteer removal button and remove signed up user from the event
const confirmRemoval = async () => {
  try {
    await useFetch(
      `/api/events/${route.params.id}/register/${userIdToRemove.value}`,
      {
        method: 'DELETE',
      },
    )
    volunteerList.value = volunteerList.value.filter(
      (user) => user.id !== userIdToRemove.value,
    )
    isConfirmationModalOpen.value = false
    userIdToRemove.value = null
  } catch (error) {
    console.error('Failed to remove volunteer')
  }
}
</script>

<template>
  <div class="py-20 flex justify-center flex-wrap items-center px-4">
    <CurveBackground />

    <div
      class="bg-white bg-opacity-95 md:bg-opacity-80 shadow-2xl backdrop-blur-none md:backdrop-blur-md rounded-3xl z-80 p-10 flex justify-center flex-wrap items-center w-full"
    >
      <div v-if="isAdmin" class="w-full">
        <div>
          <h1 class="text-center text-2xl mb-5">VOLUNTEER LIST</h1>
        </div>

        <div class="w-full relative overflow-x-auto rounded-lg">
          <table
            class="w-full text-sm text-left rtl:text-right text-black dark:text-black"
          >
            <thead
              class="w-full text-xs text-gray-700 uppercase dark:bg-gray-400 dark:text-gray-800"
            >
              <tr>
                <th class="px-20 py-3">Name</th>
                <th class="px-40 py-3">Email</th>
                <th class="px-40 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="user in volunteerList"
                :key="user.id"
                class="bg-white border-b dark:bg-white-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-stone-200"
              >
                <td class="px-20 py-3 inline-block">
                  {{ user.name }}
                </td>

                <td class="px-40 py-3">
                  {{ user.email }}
                </td>

                <td class="px-40 py-3">
                  <div>
                    <button @click="removeUser(user.id)">
                      <svg
                        class="h-8 w-8 text-red-500"
                        viewBox="0 0 24 24"
                        fill="red"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="9" y1="9" x2="15" y2="15" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="isConfirmationModalOpen"
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
            >
              &#8203;
            </span>
            <div
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="p-4 md:p-5 text-center">
                <svg
                  class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 class="mb-5 text-lg font-normal text-black">
                  Are you sure to delete this user?
                </h3>
                <h5 class="mb-5 font-normal text-gray-500">
                  "This action cannot be undone."
                </h5>
                <div>
                  <div
                    class="flex place-content-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
                  >
                    <button
                      class="text-gray-500 bg-white hover:bg-white-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      @click="cancelRemoval"
                    >
                      No,cancel
                    </button>

                    <button
                      class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                      @click="confirmRemoval"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <p class="text-red-500 flex items-center text-xl">
          You need to be an admin to access this page.
        </p>
      </div>
    </div>
  </div>
</template>
