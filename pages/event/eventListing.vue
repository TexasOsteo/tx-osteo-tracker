<script lang="ts">

// Import Prisma client
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()


// Set up a data property to store the event details and use lifecycle hook mounted to fetch the event data:
export default {
  props: {
    eventId: String, // Receive the event ID as a prop
  },
  data() {
    return {
      event: null,
    };
  },
  async mounted() {
    if (this.eventId) {
      this.event = await PrismaClient.event.findUnique({
        where: {
          id: this.eventId,
        },
      });
    }
  },
};

</script>

<!-- Define props for the component to have -->
<template>
  <div>
    <h2>Event Details</h2>
    <div v-if="event">
      <h3>{{ event.name }}</h3>
      <p>Organizer: {{ event.organizer }}</p>
      <p>Location: {{ event.location }}</p>
      <p>Date and Time: {{ event.dateAndTime }}</p>
      <p>Duration: {{ event.duration }} hours</p>
      <p>Languages: {{ event.languages.join(', ') }}</p>
      <p>Hours Offered: {{ event.hoursOffered }} hours</p>
      <p>Prerequisites: {{ event.prerequisites.join(', ') }}</p>
      <p>Volunteer Positions: {{ event.volunteerPositions.join(', ') }}</p>
      <p>Phone Number: {{ event.phoneNumber }}</p>
      <p>Email: {{ event.email }}</p>
      <p>Capacity: {{ event.capacity }}</p>
      <!-- Add additional fields like thumbnail here -->
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<!-- figure out-->
<template>
  <div>
    <event-details :eventId="selectedEventId" />
  </div>
</template> 

<script lang="ts">
import EventDetails from '@/components/EventListing.vue';

export default {
  data() {
    return {
      selectedEventId: 'your-event-id', // Set the event ID you want to display
    };
  },
  components: {
    EventDetails,
  },
};
</script>
