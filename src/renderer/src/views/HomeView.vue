<script setup lang="ts">
import { EThemeType, useTheme } from '@renderer/composables/theme'
import { languageOptions } from '@renderer/locales'
import { computed, onMounted, ref } from 'vue'
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

// 版本
const version = ref('v0.0.0')
const newVersionReady = ref(false)
const newVersion = ref('v0.0.1')

async function getCurrentVersion() {
  version.value = await ipcRenderer.invoke('get-current-version')
}

async function checkUpdate() {
  await ipcRenderer.invoke('check-update')
}

async function applyUpdate() {
  await ipcRenderer.invoke('apply-update')
}

onMounted(() => {
  getCurrentVersion()
})

ipcRenderer.on('new-version-ready', (_, version) => {
  newVersionReady.value = true
  newVersion.value = version
})
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

    <div class="margin-col">
      <n-button @click="checkUpdate">检查更新</n-button>
      <p class="margin-col">当前版本：{{ version }}</p>
      <p v-if="newVersionReady" class="margin-col">
        新版本已就绪：{{ newVersion }}
        <span style="color: #409eff" @click="applyUpdate">点击重启应用并更新</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.margin-col {
  margin: 8px;
}
</style>
