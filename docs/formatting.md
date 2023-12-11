# Formatting

We use Prettier and ESLint to ensure code style remains consistent across the entire project. However, there are a few things that cannot be checked by these extensions that need to be kept in mind:

### Component Structure

In Vue, there are multiple ways of declaring components, props, and styles. However, we only use one method for each:

- Only use `<script setup lang="ts">`. This means you should never use the `export default` format.
- Define props using `defineProps<{...}>()`. This is the best method for declaring props when using TypeScript because it is consistent with all other typing methods.
- Define emits using `defineEmits<{...}>()`. This is for the same reasons as above.
- Do not use `<style>` tags. We are using Tailwind instead.

This means components should look like so:

```vue
<script setup lang="ts">
  // ... Import code

  const props = defineProps<{
    id: string
    name: string
    type: 'attendee' | 'signed-up'
    eventId: string
  }>()

  const emit = defineEmits<{
    removed: [newEvent: SerializeObject<FullEvent>]
  }>()

  // ...
</script>

<template>
  <div
    class="w-full py-5 px-3 bg-slate-100 shadow opacity-95 flex flex-wrap items-center justify-between rounded-md"
  >
    <div class="h-full align-middle">
      <p class="h-full align-middle">{{ name }}</p>
    </div>
    <!-- ... more elements -->
  </div>
</template>
```

### File Structure and Naming

Nuxt is very strict about file structure. Components need to be in the `components` directory, stores need to be in the `store` directory, etc.
However, there are a few other rules that should be followed:

- Pages and API routes need to have simple names because they will appear in URLs. This can be confusing since we will have duplicate names like `[id].ts`, but this is a necessary sacrifice.
- Server API files should be as close to their endpoint's root as possible. For example, look at how the `/server/api/users/` and `/server/api/images` files are structured. All of their `*.ts` files are in these directories without sub-directories. Of course, sometimes there needs to be sub-directories like with `events`, but only create them when necessary.
- All files should be lower case except for components in the `components` directory.
