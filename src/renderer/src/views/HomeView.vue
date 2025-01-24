<script setup lang="ts">
const handleCreateAboutWin = () => {
  console.log('create about win')
  window.electron.ipcRenderer.send('create-about-win')
}
</script>

<template>
  <div>
    Home
    <button @click="handleCreateAboutWin">to about</button>
  </div>
</template>
