<script setup lang="ts">
definePageMeta({
  layout: false, // Disable default layout with navbar since this page has a custom one
})
</script>

<template>
  <div
    class="h-20 w-[100%] bg-white flex absolute items-center shadow z-10 overflow-hidden-x-hidden mx-auto font-lexend"
  >
    <div class="h-full w-1/2 flex items-center justify-left ml-10">
      <h1 class="text-xl hidden sm:block">TEXAS OSTEOPOROSIS FOUNDATION</h1>
      <h1 class="text-3xl block sm:hidden">TOF</h1>
    </div>
    <div class="h-full w-1/2 flex items-center justify-end">
      <a href="/api/auth/login">
        <button
          class="py-5 px-10 mr-5 bg-white rounded-md hover:bg-[#F0CC5A] hover:text-white transition duration-300 ease-in-out hidden sm:block"
        >
          SIGN UP
        </button>
      </a>
      <a href="/api/auth/login">
        <button
          class="py-5 px-10 mr-5 bg-white rounded-md hover:bg-[#F0CC5A] hover:text-white transition duration-300 ease-in-out hidden sm:block"
        >
          LOG IN
        </button>
      </a>
    </div>
  </div>
  <div class="flex flex-wrap z-0 overflow-x-hidden overflow-y-hidden">
    <div
      class="h-screen max-w-screen-xl mx-auto my-auto flex flex-wrap-reverse items-center justify-center text-center pt-20"
    >
      <div class="text-center items-center justify-center lg:mr-20 font-lexend">
        <h1 class="text-5xl font-bold">VOLUNTEER AT TOF</h1>
      <div class="text-center items-center justify-center lg:mr-20 font-lexend">
        <h1 class="text-5xl font-bold ">VOLUNTEER AT TOF</h1>
        <p class="py-5 text-xl">
          Start volunteering and make a change in the world today!
        </p>
        <div class="flex flex-wrap items-center justify-center font-lexend">
          <a href="/api/auth/login">
            <button
              class="py-5 px-10 mr-5 bg-[#0DA49B] text-white rounded-md hover:bg-[#F0CC5A] hover:text-white transition duration-300 ease-in-out text-2xl mb-20"
            >
              Sign Up
            </button>
          </a>
          <a href="/api/auth/login">
            <button
              class="py-5 px-10 mr-5 bg-[#0DA49B] text-white rounded-md hover:bg-[#F0CC5A] hover:text-white transition duration-300 ease-in-out text-2xl mb-20"
            >
              Log In
            </button>
          </a>
        </div>
      </div>
      <CompanyLogo />
    </div>

    <div
      class="w-full bg-[#0DA49B] flex flex-wrap-reverse items-center justify-center font-sans"
    >
      <div>
        <div class="container flex my-10 text-white">
          <div class="px-5">
            <h4>Texas Osteoporosis Foundation ©</h4>
          </div>
          <div class="mr-10">
            <h2 class="text-lg font-bold">ABOUT</h2>
            <ul>
              <li>
                <a href="https://www.texasosteo.org/about-us">About US</a>
              </li>
              <li>
                <a href="https://www.texasosteo.org/osteo-101-bone-health">
                  Osteo 101
                </a>
              </li>
              <li>
                <a href="https://www.texasosteo.org/take-the-test">
                  Take the Test
                </a>
              </li>
              <li><a href="https://www.texasosteo.org/">Homepage</a></li>
            </ul>
          </div>

          <div class="mr-10">
            <h2 class="text-lg font-bold">VOLUNTEER</h2>
            <ul>
              <li><a href="/api/auth/login">Sign In</a></li>
              <li><a href="/api/auth/login">Log In</a></li>
              <li><a href="https://www.texasosteo.org/donate">Donate</a></li>
            </ul>
          </div>

          <div class="mr-10">
            <h2 class="text-lg font-bold">HELP</h2>
            <ul>
              <li>
                <a href="https://www.texasosteo.org/get-involved">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
