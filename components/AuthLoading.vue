<script setup lang="ts">
import { SimpleStack, SimpleSpinner } from "@materials";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
</script>
<template>
  <div class="container">
    <SimpleStack
      style="{height: 100%}"
      distribution="center"
      alignment="center"
      vertical
    >
      <h1>認証情報を確認</h1>
      <SyncLoader color="rgba(255, 194, 85, 1)"></SyncLoader>
    </SimpleStack>
  </div>
</template>
<style scoped>
.container {
  margin-top: var(--space-10);
}
</style>
