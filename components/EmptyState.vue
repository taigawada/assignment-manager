<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "課題が追加されると、ここに表示されます",
  },
});
</script>
<template>
  <div class="empty-state">
    <img
      alt="empty-state"
      src="@/assets/emptyState1.png"
      class="empty-state-img"
    />
    <h2 class="empty-state-header">{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</template>
<style scoped lang="scss">
.empty-state {
  width: 100%;
  text-align: center;
}
.empty-state-img {
  margin-top: var(--space-10);
  width: 40%;
  filter: drop-shadow(0px 5px 20px rgba(42, 49, 57, 0.2));
}
.empty-state-header {
  font-size: var(--font-size-7);
  font-weight: 500;
}
</style>
