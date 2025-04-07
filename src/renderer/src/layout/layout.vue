<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <n-layout class="layout" style="height: 100vh; width: 100%">
    <div class="layout__header">
      <Header />
    </div>
    <div class="layout__content">
      <router-view></router-view>
    </div>
  </n-layout>
</template>
