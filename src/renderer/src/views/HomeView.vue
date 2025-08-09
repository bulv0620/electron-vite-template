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
const newVersion = ref('')
const newVersionReady = ref(false)
const checkLoading = ref(false)

async function getCurrentVersion() {
  version.value = await ipcRenderer.invoke('get-current-version')
}

async function checkUpdate() {
  checkLoading.value = true
  try {
    const version = await ipcRenderer.invoke('check-update')

    if (version) {
      newVersion.value = version
    }
  } catch (error) {
    console.error(error)
  } finally {
    checkLoading.value = false
  }
}

function applyUpdate() {
  ipcRenderer.invoke('apply-update')
}

onMounted(() => {
  getCurrentVersion()
})

ipcRenderer.on('new-version-ready', () => {
  newVersionReady.value = true
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
      <n-button :loading="checkLoading" @click="checkUpdate">检查更新</n-button>
      <p class="margin-col">当前版本：{{ version }}</p>
      <p v-if="newVersion" class="margin-col">
        发现新版本：{{ newVersion }} (将自动下载新版本程序)
      </p>
      <p v-if="newVersionReady" class="margin-col" @click="applyUpdate">
        新版本已就绪，
        <span class="restart-span">点击重启</span>
        更新
      </p>
    </div>
  </div>
</template>

<style scoped>
.margin-col {
  margin: 8px;
}

.restart-span {
  color: #409eff;
  cursor: pointer;
}
</style>
