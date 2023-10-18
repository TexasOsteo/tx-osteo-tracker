<script setup lang="ts">
/**
 * This component makes it easier to make dynamic lists like SelectMultiple and TextMultiple
 */

import _ from 'lodash'

const props = defineProps<{
  title: string
  addText: string
  name: string
  defaultValue: string
  empty?: boolean
  noDuplicates?: boolean
}>()

const values = ref<string[]>(props.empty ? [] : [props.defaultValue])

function duplicateValidator(node: FormKitNode<unknown>) {
  const arr = node.value as string[]
  const unique = _.uniq(arr)
  return unique.length === arr.length
}
</script>

<template>
  <h1 class="block mb-1 font-bold">{{ title }}</h1>
  <FormKit
    v-slot="{ items }"
    v-model="values"
    :name="name"
    type="list"
    :validation-rules="{ noDuplicates: duplicateValidator }"
    :validation="noDuplicates ? 'noDuplicates' : ''"
    :validation-messages="{ noDuplicates: 'No duplicates' }"
    validation-visibility="live"
    dynamic
  >
    <slot :items="items" :values="values" />
    <FormKitMessages />
    <button class="mb-2 mt-0" type="button" @click="values.push(defaultValue)">
      <b class="font-bold">+</b>
      {{ addText }}
    </button>
  </FormKit>
</template>
