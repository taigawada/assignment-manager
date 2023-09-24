<script setup lang="ts">
import { SimpleSkeleton } from "@materials";
</script>
<template>
  <div style="text-align: left">
    <SimpleSkeleton
      style="margin: var(--space-4) 0"
      :size="{ width: '30%', height: '30px' }"
      distribution="left"
    />
    <SimpleSkeleton
      :size="{ width: '80%', height: '20px' }"
      distribution="left"
    />

    <SimpleSkeleton type="text" :lines="6"></SimpleSkeleton>
  </div>
</template>
<style scoped lang="scss"></style>
