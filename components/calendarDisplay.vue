<template>
  <div><FullCalendar :options="calendarOptions" /></div>
</template>
<script lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import interactionPlugin from '@fullcalendar/interaction'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  components: {
    FullCalendar,
  },

  data() {
    return {
      calendarOptions: {
        plugins: [interactionPlugin, dayGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev next today',
          center: 'title',
          // right: 'dayGridMonth, dayGridWeek, listDay',
        },
        nowIndicator: true,
        editable: true,
        events: this.getEvents(),
      },
    }
  },
  async created() {
    await this.getEvents()
  },

  methods: {
    async getEvents() {
      const response = await useFetch(`/api/events`, {
        method: 'get',
      })
      const event = response.data
      // const {name,location, organizer, dateAndTime} = event
    },
  },
}
</script>
<style lang="scss" scoped></style>
