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
  <EventListing />
</template>
