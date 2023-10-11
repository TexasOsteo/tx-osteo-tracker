<template>
  <div class="flex justify-center">
    <form class="w-full max-w-lg">
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-name"
          >
            Name
          </label>
          <input
            id="grid-name"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            placeholder="Jason Smith"
          />
          <!--<p class="text-red-500 text-xs italic">Please fill out this field.</p> -->
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-email"
          >
            Email
          </label>
          <input
            id="grid-email"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="jasonSmith@gmail.com"
          />
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-password"
          >
            Password
          </label>
          <input
            id="grid-password"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="password"
            placeholder="******************"
          />
          <!-- <p class="text-gray-600 text-xs italic">
            Make it as long and as crazy as you'd like
          </p> -->
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="dateOfBirth">
          Date of Birth
        </label>
        <input
          id="dateOfBirth"
          class="appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="date"
        />
      </div>

      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-qualifications"
          >
            Qualifications
          </label>
          <input
            id="grid-qualifications"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="CPR cert, density screening cert, etc."
          />
          <p class="text-red-500 text-xs italic">
            Please use comma seperated list.
          </p>
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-language"
          >
            Primary Language
          </label>
          <div class="relative">
            <select
              id="grid-language"
              class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>Mandorin</option>
              <option>Other</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
          <p class="text-gray-600 text-xs italic">
            If Other, please specify in notes.
          </p>
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-zip"
          >
            Notes
          </label>
          <input
            id="grid-notes"
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Speak Vietnamese, Allegic to peanuts, wheelchair-bound, etc."
          />
          <p class="text-redd-500 text-xs italic">
            Please use comma seperated list.
          </p>
        </div>
      </div>

      <div class="mb-4 flex justify-center">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="submitForm"
        >
          Create Profile
        </button>
      </div>
    </form>
  </div>
</template>

<script></script>
