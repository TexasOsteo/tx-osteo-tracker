<script setup lang="ts">
import Avatar from 'vue-boring-avatars'

const props = defineProps<{
  class?: string
}>()

// Needed because class is a protected keyword
const className = ref(props.class ?? '')

const claims = getCurrentUserTxOsteoClaims()
const id = claims?.sub ?? ''
</script>

<template>
  <Avatar :class="className" :name="id" variant="beam" />
</template>
