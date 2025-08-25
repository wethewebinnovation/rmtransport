<template>
  <router-view v-slot="{ Component, route }">
    <component :is="route.meta.layout === 'none' ? Component : BaseLayout">
      <component :is="Component" />
    </component>
  </router-view>
</template>

<script setup>
import BaseLayout from "./BaseLayout.vue";
</script>
