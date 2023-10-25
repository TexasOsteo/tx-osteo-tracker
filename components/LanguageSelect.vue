<script setup lang="ts">
import ISO6391 from 'iso-639-1'

const allLanguages = ISO6391.getLanguages(ISO6391.getAllCodes())
const languageOptions = Object.fromEntries(
  allLanguages.map((obj) => [obj.code, `${obj.name} (${obj.nativeName})`]),
)
</script>

<template>
  <SelectMultiple
    :options="languageOptions"
    title="Languages"
    add-text="Add new language"
    default-value="en"
    name="languages"
    validation="noDuplicates|required"
    
  />
</template>
