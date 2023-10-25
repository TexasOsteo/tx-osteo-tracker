<script setup lang="ts">
const { data } = await useFetch('/api/auth/me')
const events = await useFetch('/api/events/')
const eventData = events.data
</script>
<template>
  <div class="w-[426px] h-[1219px] relative">
    <div class="w-[426px] h-[1219px] left-0 top-0 absolute bg-white"></div>
    <div class="w-[426px] h-[1219px] left-0 top-0 absolute bg-white"></div>
    <div class="w-[352.90px] h-[834.76px] left-[37px] top-[62px] absolute">
      <div class="w-[225px] h-[225px] left-[59px] top-0 absolute">
        <div
          class="w-[225px] h-[225px] left-0 top-0 absolute bg-zinc-300 rounded-full"
        ></div>
        <div class="w-[135px] h-[135px] left-[45px] top-[45px] absolute"></div>
      </div>
      <div class="w-[352.90px] h-[477.76px] left-0 top-[357px] absolute">
        <div
          class="w-[342px] h-8 left-[3px] top-[47px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
        >
          NAME:{{ data?.name }}
        </div>

        <div
          class="w-[341.51px] h-[50.48px] left-[3px] top-[158px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
        >
          EMAIL:{{ data?.email }}
        </div>
        <div
          class="w-[341.51px] h-[50.48px] left-0 top-[246px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
        >
          PHONE NUMBER:
        </div>
        <div
          class="w-[341.51px] h-[50.48px] left-[3px] top-[349px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
        >
          LANGUAGES: {{ data?.languages }}

          <div
            class="w-[352.90px] h-[35.80px] left-0 top-[207px] absolute text-black text-xl font-light font-['Work Sans'] underline tracking-[4px]"
          ></div>
          <div
            class="w-[352.90px] h-[35.80px] left-0 top-[305px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
          ></div>
          <div
            class="w-[352.90px] h-[69.76px] left-0 top-[408px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
          ></div>
        </div>
      </div>
      <div
        class="w-[350px] h-[54px] left-[38px] top-[1100px] absolute bg-white rounded-[20px] border border-teal-500"
      ></div>
      <div
        class="w-[350px] h-[54px] left-[36px] top-[1200px] absolute bg-teal-500 rounded-[20px]"
      ></div>
      <div
        class="w-[350px] h-[54px] left-[36px] top-[1300px] absolute bg-red-600 rounded-[20px]"
      ></div>
      <button
        class="w-[191px] h-7 left-[115px] top-[1110px] absolute text-center text-teal-500 text-xl font-light font-['Work Sans'] tracking-[4px]"
      >
        EDIT ACCOUNT
      </button>
      <button
        class="w-[191px] h-7 left-[115px] top-[1210px] absolute text-center text-white text-xl font-normal font-['Work Sans'] tracking-[4px]"
      >
        SIGN OUT
      </button>
      <button
        class="w-[236px] h-7 left-[95px] top-[1310px] absolute text-center text-white text-xl font-normal font-['Work Sans'] tracking-[4px]"
      >
        DELETE ACCOUNT
      </button>
    </div>
  </div>
  <div
    class="w-[352.90px] h-[69.76px] left-[40px] top-[900px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
  >
    USER NOTES: {{ data?.userNotes }}
  </div>

  <div
    class="w-[352.90px] h-[69.76px] left-[40px] top-[1000px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
  >
    QUALIFICATIONS: {{ data?.qualifications }}
  </div>

  <div
    class="w-[352.90px] h-[69.76px] left-[600px] top-[200px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
  >
    UPCOMING EVENTS:
    <div
      v-if="eventData != null"
      class="w-[600px] h-[50px] text-align:right bg-[#F8F8F8]"
    >
      <h1 style="text-align:" v-for="event in eventData" :key="event.id">
        {{ event.name.toUpperCase() }}
      </h1>
    </div>
  </div>
  <div
    class="w-[352.90px] h-[69.76px] left-[600px] top-[300px] absolute text-black text-xl font-light font-['Work Sans'] tracking-[4px]"
  >
    PAST EVENTS:
    <div
      v-if="eventData != null"
      class="w-[600px] h-[50px] text-align:right bg-[#F8F8F8]"
    >
      <h1 v-for="event in eventData" :key="event.id">
        {{ !event.isSignUpAvailable }}
      </h1>
    </div>
  </div>
</template>
