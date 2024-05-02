<script setup lang="ts">
import ISO6391 from 'iso-639-1'

const { data } = await useFetch('/api/users/me')
const userID = ref(data && data.value ? [data.value.id] : [])
const DOB = ref(data.value?.dateOfBirth)
const formattedDOB = DOB.value?.split('T')[0]

async function deleteUser() {
  if (!confirm('Are you sure? This action cannot be undone')) return

  await useFetch(`/api/users/${userID.value}`, {
    method: 'DELETE',
  })

  const cookieRef1 = useCookie(useRuntimeConfig().public.txosteo_token)
  const cookieRef2 = useCookie(useRuntimeConfig().public.auth0_token)
  cookieRef1.value = null
  cookieRef2.value = null

  const router = useRouter()
  router.push('/')
}
</script>

<template>
  <nav
    id="AccountInfo"
    class="z-20 w-full p-2 flex-none bg-white border-2 border-t-gray-200 border-r-gray-200 justify-center"
  >
    <div
      id="OsteoLogoFiller"
      class="w-full flex flex-wrap items-center justify-center p-5"
    >
      <div class="w-full sm:w-1/2">
        <ProfileAvatar class="w-full h-full rounded-full drop-shadow-lg" />
      </div>
    </div>

    <div id="UserInfo" class="p-3 my-2 bg-[#FFF] rounded-sm">
      <p id="MyName" class="text-gray-700 text-3xl">
        {{ data?.name }}
      </p>
      <br />
      <p id="MyHours" class="text-gray-700 text-2xl">
        Total Hours: {{ data?.numHours }}
      </p>
      <br />
      <p id="MyEmail" class="text-gray-700 text-large mb-2">
        Email: {{ data?.email }}
      </p>
      <p id="MyBirthday" class="text-gray-700 text-large mb-2">
        <span class="text-gray-700">Birthday</span>
        <span class="text-gray-700">: {{ formattedDOB }}</span>
      </p>

      <div id="MyLanguages" class="text-gray-700 text-large mb-2">
        <p>
          Languages:
          <span v-if="!data?.languages || data.languages.length == 0">
            None
          </span>
        </p>
        <ul v-if="data?.languages && data.languages.length > 0">
          <li v-for="(lang, index) in data.languages" :key="index" class="ml-5">
            • {{ ISO6391.getName(lang) }}
          </li>
        </ul>
      </div>

      <div
        id="MyNotes"
        class="text-gray-700 text-large font-['Work Sans'] mb-2"
      >
        <p>
          Notes:
          <span v-if="!(data?.userNotes && data.userNotes.length > 0)">
            None
          </span>
        </p>
        <ul v-if="data?.userNotes && data.userNotes.length > 0">
          {{
            data.userNotes
          }}
        </ul>
      </div>

      <div
        id="MyQualifications"
        class="mb-3 text-gray-700 text-large font-lexend"
      >
        <p>
          Qualifications:
          <span
            v-if="
              !(
                data?.verifiedQualifications &&
                data.verifiedQualifications.length > 0
              )
            "
          >
            None
          </span>
        </p>
        <ul
          v-if="
            data?.verifiedQualifications &&
            data.verifiedQualifications.length > 0
          "
        >
          <li
            v-for="(qual, index) in data.verifiedQualifications"
            :key="index"
            class="ml-5"
          >
            • {{ qual.name }}
          </li>
        </ul>
      </div>
    </div>

    <div
      id="AccountInteraction"
      class="flex flex-col items-center bg-white rounded-sm"
    >
      <NuxtLink
        to="/qualifications/application"
        class="rounded-lg bg-yellow-500 w-full p-3 mb-4 text-white text-lg hover:bg-yellow-600"
      >
        Apply For Qualification
      </NuxtLink>
      <NuxtLink
        to="/users/me/edit"
        class="rounded-lg bg-yellow-500 w-full p-3 mb-4 text-white text-lg hover:bg-yellow-600"
      >
        Edit Account
      </NuxtLink>
      <button
        class="rounded-lg bg-red-500 w-full p-3 mb-4 text-white text-lg hover:bg-red-600"
        @click="deleteUser"
      >
        Delete Account
      </button>
    </div>
  </nav>
</template>

<style>
#AccountInfo {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
