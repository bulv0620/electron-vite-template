<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <div class="layout">
    <div class="layout__header">
      <Header />
    </div>
    <div class="layout__content">
      <router-view></router-view>
    </div>
  </div>
</template>
