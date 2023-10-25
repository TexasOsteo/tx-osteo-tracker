<script>
export default {
  data() {
    return {
      isExpanded: false,
    }
  },
  methods: {
    toggleExpanded() {
      this.isExpanded = !this.isExpanded
    },
  },
}
</script>

<template>
  <div className="h-screen w-screen bg-slate-500">
    <div className="bg-white mx-20 p-5 rounded-md shadow-xl flex flex-wrap">
      <div className="flex flex-wrap mb-5 w-[90%]">
        <div className="flex flex-wrap items-end">
          <h1 className="text-4xl font-bold font-sans mr-10">Event Name</h1>
          <h3 className="mr-20 mt-5">Capacity</h3>
        </div>
        <div v-if="!isExpanded" className="flex flex-wrap mt-5">
          <h3 className="mr-20 mt-5">Organizer</h3>
          <h3 className="mr-20 mt-5">Location</h3>
          <h3 className="mr-20 mt-5">Date and Time</h3>
        </div>
        <div
          v-if="isExpanded"
          className="flex flex-wrap transform translate-y-5 bg-slate-200 px-5 pb-5 rounded-lg"
        >
          <h3 className="mr-20 mt-5">Organizer</h3>

          <h3 className="mr-20 mt-5">Date and Time</h3>
          <h3 class="mr-20 mt-5">Hours Offered</h3>

          <div className="flex flex-wrap items-center mt-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.156 13.544C8.899 12.01 12 8.876 12 6C12 4.4087 11.3679 2.88258 10.2426 1.75736C9.11742 0.632141 7.5913 0 6 0C4.4087 0 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 2.37122e-08 4.4087 0 6C0 8.876 3.1 12.01 4.844 13.544C5.16211 13.8279 5.5736 13.9849 6 13.9849C6.4264 13.9849 6.83789 13.8279 7.156 13.544ZM4 6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4C6.53043 4 7.03914 4.21071 7.41421 4.58579C7.78929 4.96086 8 5.46957 8 6C8 6.53043 7.78929 7.03914 7.41421 7.41421C7.03914 7.78929 6.53043 8 6 8C5.46957 8 4.96086 7.78929 4.58579 7.41421C4.21071 7.03914 4 6.53043 4 6Z"
                fill="black"
              />
            </svg>
            <h3 class="mr-20 ml-3">Location</h3>
          </div>

          <div className="flex flex-wrap items-center mt-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.552 22.133C15.112 22.08 11.031 21.516 6.757 17.243C2.484 12.969 1.921 8.88897 1.867 7.44797C1.787 5.25197 3.469 3.11897 5.412 2.28597C5.64598 2.18494 5.9022 2.14647 6.15553 2.17435C6.40886 2.20222 6.65059 2.29548 6.857 2.44497C8.457 3.61097 9.561 5.37497 10.509 6.76197C10.7176 7.0667 10.8068 7.43752 10.7596 7.80377C10.7123 8.17002 10.532 8.5061 10.253 8.74797L8.302 10.197C8.20774 10.265 8.14139 10.365 8.11528 10.4783C8.08916 10.5916 8.10505 10.7105 8.16 10.813C8.602 11.616 9.388 12.812 10.288 13.712C11.189 14.612 12.441 15.45 13.3 15.942C13.4077 16.0024 13.5345 16.0193 13.6543 15.9892C13.774 15.9591 13.8777 15.8842 13.944 15.78L15.214 13.847C15.4475 13.5368 15.7919 13.329 16.1752 13.2672C16.5584 13.2053 16.9508 13.2941 17.27 13.515C18.677 14.489 20.319 15.574 21.521 17.113C21.6826 17.3209 21.7854 17.5684 21.8187 17.8296C21.8519 18.0908 21.8144 18.3562 21.71 18.598C20.873 20.551 18.755 22.214 16.552 22.133Z"
                fill="black"
              />
            </svg>
            <h3 class="mr-20 ml-3">Phone Number</h3>
          </div>

          <div className="flex flex-wrap items-center mt-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                fill="black"
              />
            </svg>
            <h3 class="mr-20 ml-3">Email</h3>
          </div>

          <h3 class="mr-20 mt-5">Volunteer Positions</h3>

          <div className="flex flex-wrap items-center mt-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 8L11 14M4 14L10 8L12 5M2 5H14M7 2H8M22 22L17 12L12 22M14 18H20"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h3 class="mr-20 ml-3">Languages</h3>
          </div>

          <button
            className="w-full bg-[#0DA49B] text-white hover:bg-white hover:text-black py-3 mt-5 rounded-md"
          >
            REGISTER
          </button>
        </div>
      </div>
      <div className="w-[10%] flex align-bottom justify-center">
        <button
          className="text-blue-500 hover:underline"
          @click="toggleExpanded"
        >
          <svg
            v-if="!isExpanded"
            width="28"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26 2L14 14L2 2"
              stroke="black"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <svg
            v-if="isExpanded"
            width="28"
            height="16"
            viewBox="0 0 28 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 14L14 2L26 14"
              stroke="black"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
