<script setup lang="ts">
const props = defineProps<{
  isAdmin?: boolean
}>()

function catToLabel(cat: string, suffix = '') {
  return (
    cat
      .split('_')
      .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
      .join(' ') + suffix
  )
}

function getUserOptions() {
  const userCategories: string[] = Object.values(UserEmailCategories)
  const userLabels = userCategories.map((c) => catToLabel(c))
  return Object.fromEntries(userCategories.map((c, i) => [c, userLabels[i]]))
}

function getAdminOptions() {
  const adminCategories: string[] = Object.values(AdminEmailCategories)
  const adminLabels = adminCategories.map((c) => catToLabel(c, ' (Admin-only)'))
  return Object.fromEntries(adminCategories.map((c, i) => [c, adminLabels[i]]))
}

const options = computed(() =>
  props.isAdmin
    ? { ...getUserOptions(), ...getAdminOptions() }
    : getUserOptions(),
)
</script>

<template>
  <FormKit
    type="checkbox"
    label="Email Categories"
    :options="options"
    name="subscribedEmailCategories"
    outer-class="mb-5 w-4/5"
    help="Subscribe or unsubscribe to these email categories"
  />
</template>
