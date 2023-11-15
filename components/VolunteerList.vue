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
        qualification: user.qualifications,
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
const cancelRemoval = () => {
  isConfirmationModalOpen.value = false
  userIdToRemove.value = null
}
// to remove volunteers
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
  <div v-if="isAdmin">
    <div><h1 class="text-center text-2xl">VOLUNTEER LIST</h1></div>
    <ul>
      <li v-for="user in volunteerList" :key="user.id">
        <div class="box-border h-10 w-full p-2 border-4 flex mb-1">
          <div class="flex grid-rows-4 gap-20">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.7549 13.9999C18.0502 14 18.3427 14.0583 18.6155 14.1715C18.8883 14.2846 19.1362 14.4504 19.3449 14.6593C19.5536 14.8682 19.7192 15.1162 19.8321 15.3892C19.945 15.6621 20.003 15.9545 20.0029 16.2499V17.1679C20.0029 17.7409 19.8239 18.2996 19.4909 18.7659C17.9449 20.9299 15.4209 22.0009 12.0009 22.0009C8.57891 22.0009 6.05591 20.9289 4.51391 18.7649C4.18203 18.2989 4.00376 17.741 4.00391 17.1689V16.2489C4.00391 15.6524 4.24085 15.0804 4.66262 14.6586C5.08439 14.2368 5.65643 13.9999 6.25291 13.9999H17.7549ZM11.9999 2.00488C12.6565 2.00488 13.3067 2.13421 13.9133 2.38548C14.52 2.63676 15.0711 3.00506 15.5354 3.46935C15.9997 3.93364 16.368 4.48484 16.6193 5.09147C16.8706 5.69809 16.9999 6.34827 16.9999 7.00488C16.9999 7.66149 16.8706 8.31167 16.6193 8.9183C16.368 9.52493 15.9997 10.0761 15.5354 10.5404C15.0711 11.0047 14.52 11.373 13.9133 11.6243C13.3067 11.8756 12.6565 12.0049 11.9999 12.0049C10.6738 12.0049 9.40205 11.4781 8.46437 10.5404C7.52669 9.60273 6.99991 8.33097 6.99991 7.00488C6.99991 5.6788 7.52669 4.40703 8.46437 3.46935C9.40205 2.53167 10.6738 2.00488 11.9999 2.00488Z"
                fill="grey"
              />
            </svg>
            <table className="table-auto">
              <tbody>
                <tr>
                  <td class="w-80">{{ user.name }}</td>
                  <td class="w-80">{{ user.email }}</td>
                  <td class="w-80">
                    <button @click="removeUser(user.id)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="red"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                          fill="red"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
    </ul>
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
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="modal-content">
            <p>Are you sure to delete this user?</p>
            <div>
              <div
                class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
              >
                <button
                  class="text-gray-500 bg-white hover:bg-white-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  @click="cancelRemoval"
                >
                  Cancel
                </button>

                <button
                  class="text-gray-500 bg-white hover:bg-white-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-blue-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
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
</template>
