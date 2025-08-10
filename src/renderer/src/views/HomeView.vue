<script setup lang="ts">
import { EThemeType, useTheme } from '@renderer/composables/theme'
import { languageOptions } from '@renderer/locales'
import { computed, onMounted, ref, watch } from 'vue'
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
const showConfirmModal = ref(false)
const checkLoading = ref(false)
const downloadLoading = ref(false)
const downloaded = ref(false)

watch(newVersionReady, (val) => {
  if (val) {
    showConfirmModal.value = true
  }
})

async function getCurrentVersion() {
  version.value = await ipcRenderer.invoke('get-current-version')
}

async function checkUpdate() {
  checkLoading.value = true
  try {
    const version = await ipcRenderer.invoke('check-update')
    if (version) {
      newVersion.value = version
      downloaded.value = false
      newVersionReady.value = false
    } else {
      newVersion.value = ''
      downloaded.value = false
      newVersionReady.value = false
    }
  } catch (error) {
    console.error(error)
  } finally {
    checkLoading.value = false
  }
}

async function downloadUpdate() {
  if (downloadLoading.value || downloaded.value) return
  downloadLoading.value = true
  try {
    await ipcRenderer.invoke('download-update')
    downloaded.value = true
  } catch (error) {
    console.error(error)
  } finally {
    downloadLoading.value = false
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
      <template v-if="newVersion">
        <p class="margin-col">发现新版本：{{ newVersion }}</p>
        <n-button
          v-if="!newVersionReady"
          class="margin-col"
          :loading="downloadLoading"
          :disabled="downloadLoading || downloaded || newVersionReady"
          @click="downloadUpdate"
        >
          点击下载最新版本
        </n-button>
        <span v-else style="margin-left: 8px">更新已下载，等待重启应用</span>
      </template>
    </div>
    <n-modal
      v-model:show="showConfirmModal"
      preset="dialog"
      title="提示"
      content="新版本已就绪，是否立即重启更新?"
      positive-text="立即更新"
      negative-text="稍后"
      @positive-click="applyUpdate"
    />
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
