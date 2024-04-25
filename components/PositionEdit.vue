<script setup lang="ts">
const { data: fetchedQualifications } = await useFetch('/api/qualifications')

const qualifications = computed(() => {
  const quals = fetchedQualifications.value ?? []
  return Object.fromEntries(quals.map((q) => [q.id, q.name]))
})

const defaultQualification = computed(
  () => Object.keys(qualifications.value)[0] ?? 'None',
)
</script>

<template>
  <FormListWrapper
    v-slot="{ items, values }"
    title="Volunteer Positions"
    add-text="Add Position"
    name="positions"
    :default-value="{}"
    validation="required"
    :empty="false"
  >
    <div
      v-for="(item, index) in items"
      :key="item"
      class="p-3 mb-3 ring-1 ring-gray-400 rounded"
    >
      <button
        class="float-right translate-x-2 -translate-y-2"
        @click="() => values.splice(index, 1)"
      >
        <Icon name="mdi:close" size="1.5rem" />
      </button>
      <FormKit :index="index" type="group">
        <FormKit
          type="text"
          label="Position Name"
          name="name"
          placeholder="Name"
          validation="required"
        />

        <FormKit
          type="number"
          label="Maximum Position Capacity"
          help="Enter the maximum number of volunteers for this position."
          name="maxCapacity"
          placeholder="Capacity"
          validation="required|min:1"
          step="1"
          number="integer"
        />

        <div v-if="Object.keys(qualifications).length === 0">
          <h1 class="block mb-1 font-bold text-left">
            Qualification Prerequisites
          </h1>

          <p class="text-sm">
            No qualifications have been created. Please add them
            <NuxtLink to="/qualifications/list" class="underline text-blue-500">
              here.
            </NuxtLink>
          </p>
          <FormKit name="prerequisites" type="hidden" :value="[]" />
        </div>

        <SelectMultiple
          v-if="Object.keys(qualifications).length > 0"
          :options="qualifications"
          :empty="true"
          title="Qualification Preqrequisites"
          name="prerequisites"
          add-text="Add Prerequisite"
          validation="noDuplicates"
          :default-value="defaultQualification"
        />
      </FormKit>
    </div>
  </FormListWrapper>
</template>
