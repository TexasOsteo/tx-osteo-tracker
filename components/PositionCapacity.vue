<script setup>
const props = defineProps({
  mode: {
    type: String,
    default: 'create', // 'create' or 'edit'
  },
  initialPositions: {
    type: Array,
    default: () => [{ name: 'General', maxCapacity: 1, prerequisites: [] }],
  },
})

const { mode, initialPositions } = toRefs(props)

const list = ref(
  mode.value === 'edit'
    ? [...initialPositions.value]
    : [{ name: 'General', maxCapacity: 1, prerequisites: [] }],
)
const qualifications = ref([])

onMounted(async () => {
  const response = await fetch('/api/qualifications')
  const data = await response.json()
  qualifications.value = [
    { id: null, name: 'None' },
    ...data.map((qualification) => ({
      id: qualification.id,
      name: qualification.name,
    })),
  ]

  watch(
    () => list.value,
    (newList) => {
      newList.forEach((position) => {
        if (
          position.prerequisites === null ||
          position.prerequisites[0]?.name === 'None'
        ) {
          position.prerequisites = []
        } else if (!Array.isArray(position.prerequisites)) {
          position.prerequisites = [position.prerequisites]
        }

        // Convert maxCapacity to a number
        position.maxCapacity = Number(position.maxCapacity)
      })
    },
    { deep: true },
  )
})
</script>

<!-- rest of the template remains the same -->

<template>
  <FormKit
    v-slot="{ items, node, value }"
    v-model="list"
    type="list"
    dynamic
    name="positions"
  >
    <div class="grid grid-cols-4 gap-4">
      <FormKit
        v-for="(item, index) in items"
        :key="item"
        type="group"
        :index="index"
        name="positions"
      >
        <FormKit
          type="text"
          name="name"
          label="Position Name"
          placeholder="Position Name"
          validation="required"
          class="col-span-1"
        />

        <FormKit
          type="number"
          name="maxCapacity"
          label="Capacity"
          min="1"
          validation="required|integer"
          class="col-span-1"
        />

        <!--options= display name, return/submit corresponding id-->
        <FormKit
          type="select"
          name="prerequisites"
          label="Qualification"
          :options="qualifications.map((q) => ({ value: q, label: q.name }))"
          class="col-span-1"
        />

        <button
          type="button"
          class="col-span-1"
          @click="() => node.input(value.filter((_, i) => i !== index))"
        >
          - Remove
        </button>
      </FormKit>
    </div>

    <button
      type="button"
      class="mt-4"
      @click="
        () =>
          node.input(
            value.concat({ name: '', maxCapacity: 0, prerequisites: [] }),
          )
      "
    >
      + Add a Position
    </button>
  </FormKit>
</template>
