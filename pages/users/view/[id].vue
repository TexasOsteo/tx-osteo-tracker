<template>
  <header>
    <nuxt-link to="/">Home</nuxt-link>
    |
    <nuxt-link to="/users">Users</nuxt-link>
    |
  </header>
  <div>Not your profile, user id: {{ $route.params.id }}</div>
</template>
