<script setup lang="ts">
definePageMeta({
  layout: false,
})

const auth0Cookie = useCookie(useRuntimeConfig().public.auth0_token)
async function checkCookie() {
  if (!auth0Cookie.value) return
  const token = decodeJWT<Auth0Claims>(auth0Cookie.value)
  if (token.email_verified) {
    await navigateTo('/event/listings')
  }
}
watch(auth0Cookie, () => checkCookie())
checkCookie()

const responseText = ref<string | null>(null)
async function resendEmail() {
  responseText.value = 'Sending email...'
  const { error } = await useFetch('/api/email/verification', {
    method: 'POST',
  })
  if (error.value) {
    responseText.value = `Failed to send email: ${
      error.value.statusMessage ?? 'Unknown Reason'
    }`
  } else {
    responseText.value = 'Email Sent! Check your inbox and spam folder'
  }
}
</script>

<template>
  <div class="py-20 flex justify-center flex-wrap items-center">
    <CurveBackground />

    <div
      class="max-w-screen-lg bg-gray-100 opacity-95 rounded-3xl shadow-xl z-30 p-10 flex justify-center flex-col items-center"
    >
      <h1 class="font-bold text-4xl mb-4">Please verify your email</h1>
      <a
        class="p-4 mb-4 text-2xl text-white rounded-md shadow bg-[#0DA49B] hover:bg-white hover:text-black"
        href="/api/auth/login"
      >
        Recheck Verification
      </a>
      <button
        class="p-2 px-4 mb-4 text-white text-xl bg-gray-400 disabled:bg-gray-300 hover:bg-gray-500 font-medium rounded-md text-center"
        @click="resendEmail"
      >
        Resend Email
      </button>
      <a
        class="p-2 px-4 mb-4 text-white text-xl bg-gray-400 disabled:bg-gray-300 hover:bg-gray-500 font-medium rounded-md text-center"
        href="/api/auth/logout"
      >
        Logout
      </a>
      <p v-if="responseText" class="text-lg">
        {{ responseText }}
      </p>
    </div>
  </div>
</template>
