<script setup lang="ts">
defineProps<{
  options: Record<string, string> | string[]
  title: string
  addText: string
  name: string
  empty?: boolean
  noDuplicates?: boolean
  defaultValue: string
}>()
</script>

<template>
  <FormListWrapper
    v-slot="{ items, values }"
    :title="title"
    :add-text="addText"
    :name="name"
    :default-value="defaultValue"
    :empty="empty"
    :no-duplicates="noDuplicates"
  >
    <FormKit
      v-for="(item, index) in items"
      :key="item"
      type="select"
      suffix-icon="trash"
      :index="index"
      :options="options"
      suffix-icon-class="!p-0"
      :sections-schema="{
        suffixIcon: {
          // Change wrapper to a button for accessibility
          $el: 'button',
        },
      }"
      @suffix-icon-click="values.splice(index, 1)"
    />
  </FormListWrapper>
</template>
