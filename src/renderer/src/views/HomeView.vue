<script setup lang="ts">
const handleCreateAboutWin = () => {
  console.log('create about win')
  window.electron.ipcRenderer.send('create-about-win')
}
</script>

<template>
  <div>
    Home
    <n-button @click="handleCreateAboutWin">to about</n-button>
  </div>
</template>
