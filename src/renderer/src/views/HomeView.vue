<script setup lang="ts">
import { EThemeType, useTheme } from '@renderer/composables/theme'

const handleCreateAboutWin = () => {
  console.log('create about win')
  window.electron.ipcRenderer.send('create-about-win')
}

const { themeMode } = useTheme()

const options = [
  {
    label: '跟随系统',
    value: EThemeType.SYSTEM,
  },
  {
    label: '亮色',
    value: EThemeType.LIGHT,
  },
  {
    label: '暗色',
    value: EThemeType.DARK,
  },
]
</script>

<template>
  <div>
    Home
    <n-button @click="handleCreateAboutWin">to about</n-button>
    <n-select v-model:value="themeMode" :options="options" />
  </div>
</template>
