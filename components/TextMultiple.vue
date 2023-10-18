<script setup lang="ts">
defineProps<{
  title: string
  addText: string
  name: string
  placeholder: string
  empty?: boolean
  validation?: string
}>()
</script>

<template>
  <FormListWrapper
    v-slot="{ items, values }"
    :title="title"
    :add-text="addText"
    :name="name"
    default-value=""
    :empty="empty"
    :validation="validation"
  >
    <FormKit
      v-for="(item, index) in items"
      :key="item"
      type="text"
      :placeholder="placeholder"
      validation="required"
      suffix-icon="trash"
      :index="index"
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
