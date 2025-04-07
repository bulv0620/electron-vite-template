<script setup lang="ts">
import { useTheme } from './composables/theme'
import layout from './layout/layout.vue'

const { themeConfig } = useTheme()
</script>

<template>
  <n-config-provider :theme="themeConfig">
    <layout></layout>
  </n-config-provider>
</template>
