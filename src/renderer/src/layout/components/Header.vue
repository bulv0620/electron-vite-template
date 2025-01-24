<script setup lang="ts"></script>

<template>
  <div class="header"></div>
</template>

<style lang="less" scoped>
.header {
  height: 32px;
  line-height: 32px;
  background-color: #eee;
  border-bottom: 1px solid #ebeef5;
  text-align: center;
  -webkit-app-region: drag;

  .buttons {
    -webkit-app-region: no-drag;
  }
}
</style>
