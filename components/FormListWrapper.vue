<script setup lang="ts">
/**
 * This component makes it easier to make dynamic lists like SelectMultiple and TextMultiple
 */

import _ from 'lodash'

type ValueType = string | number | boolean | object

const props = defineProps<{
  title: string
  addText: string
  name: string
  defaultValue: ValueType
  empty?: boolean
  validation?: string
}>()

function getDefaultValue(): ValueType {
  // Since object proxies are used, we want to make sure the default value
  // is a separate instance. This creates one.
  return _.cloneDeep(props.defaultValue)
}

const values = ref<ValueType[]>(props.empty ? [] : [getDefaultValue()])

function duplicateValidator(node: FormKitNode<unknown>) {
  const arr = node.value as ValueType[]
  const unique = _.uniq(arr)
  return unique.length === arr.length
}
</script>

<template>
  <div
    class="flex relative flex-wrap flex-col justify-center items-center w-4/5"
  >
    <div className="w-full">
      <h1 class="block mb-1 font-bold text-left">{{ title }}</h1>

      <FormKit
        v-slot="{ items }"
        v-model="values"
        :name="name"
        type="list"
        :validation-rules="{ noDuplicates: duplicateValidator }"
        :validation="validation"
        :validation-messages="{ noDuplicates: 'No duplicates' }"
        validation-visibility="live"
        dynamic
      >
        <slot :items="items" :values="values" />
        <FormKitMessages />
        <button
          class="mb-2 mt-0"
          type="button"
          @click="values.push(getDefaultValue())"
        >
          <b class="font-bold">+</b>
          {{ addText }}
        </button>
      </FormKit>
    </div>
  </div>
</template>
