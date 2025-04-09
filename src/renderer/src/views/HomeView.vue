<script setup lang="ts">
import { EThemeType, useTheme } from '@renderer/composables/theme'
import { languageOptions } from '@renderer/locales'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const ipcRenderer = window.electron.ipcRenderer

const handleCreateAboutWin = () => {
  ipcRenderer.invoke('create-about-win')
}

const { themeMode } = useTheme()
const { t, locale } = useI18n()

const themeOptions = computed(() => [
  {
    label: t('theme.system'),
    value: EThemeType.SYSTEM,
  },
  {
    label: t('theme.light'),
    value: EThemeType.LIGHT,
  },
  {
    label: t('theme.dark'),
    value: EThemeType.DARK,
  },
])

const timestamp = ref(1183135260000)
</script>

<template>
  <div>
    <div class="margin-col">{{ $t('page.home') }}</div>

    <n-button class="margin-col" @click="handleCreateAboutWin">{{ $t('page.toAbout') }}</n-button>

    <div class="margin-col" style="display: flex; gap: 12px">
      <n-select v-model:value="themeMode" :options="themeOptions" style="width: 200px" />
      <n-select v-model:value="locale" :options="languageOptions" style="width: 200px" />
      <n-date-picker v-model:value="timestamp" type="date" />
    </div>
  </div>
</template>

<style scoped>
.margin-col {
  margin: 8px;
}
</style>
