<template>
  <div>
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      Our Community
    </h1>
  </div>

  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Name
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Email
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Date of Birth
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Languages
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(user, index) in users.users" :key="index">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">{{ user.email }}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">
            {{ formatDate(user.dateOfBirth) }}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-500">{{ user.languages }}</div>
        </td>
        <td class="px-6 py-4 text-right">
          <a
            href="#"
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >View</a
          >
        </td>

        <td class="px-6 py-4 text-right">
          <a
            href="#"
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >Edit</a
          >
        </td>

        <td class="px-6 py-4 text-right">
          <a
            href="#"
            class="font-medium text-red-600 dark:text-blue-500 hover:underline"
            >Delete</a
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { format } from 'date-fns'

function formatDate(dateString) {
  const date = new Date(dateString)
  date.setUTCHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 1)
  return format(date, 'yyyy-MM-dd')
}

let users = ref(null)
users = await getUsers()
// console.log(users.users)

async function getUsers() {
  return await $fetch('/api/users')
}
</script>
