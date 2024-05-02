<script setup lang="ts">
import Avatar from 'vue-boring-avatars'

const props = defineProps<{
  class?: string
  id?: string
}>()

// Needed because class is a protected keyword
const className = ref(props.class ?? '')

const targetId = computed(() => {
  if (props.id) return props.id
  const claims = getCurrentUserTxOsteoClaims()
  return claims?.sub ?? ''
})
</script>

<template>
  <Avatar :class="className" :name="targetId" variant="beam" />
</template>
