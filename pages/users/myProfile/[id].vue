<template>
  <header>
    <nuxt-link to="/">Home</nuxt-link> |
    <nuxt-link to="/users">Users</nuxt-link> |
  </header>
  <div>Your profile, user id: {{ $route.params.id }}</div>
</template>
