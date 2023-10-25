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
        <div className="flex flex-wrap mt-5">
          <h3 className="mr-20 mt-5">Organizer</h3>
          <h3 className="mr-20 mt-5">Location</h3>
          <h3 className="mr-20 mt-5">Date and Time</h3>
        </div>
      </div>
      <div className="w-[10%]">
        <button className="bg-red-600">Hello</button>
      </div>
    </div>
  </div>
</template>
