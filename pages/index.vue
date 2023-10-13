<script setup lang="ts">
const handleTransition = (to: string) => {
  navigateTo(to);
};
const nuxt = useNuxtApp();
const { data, pending } =
  await nuxt.$useAuthenticatedFetch("/api/teacher/init");
</script>
<template>
  <div class="container" distribution="spaceAround">
    <div class="children">
      <img
        class="image"
        src="https://cdn.taigawada.work/teacher_thumbnail.png"
        alt="teacher page"
        @click="() => handleTransition('/teachers')"
      />
      <span>Teacher</span>
    </div>
    <div class="children">
      <img
        class="image"
        src="https://cdn.taigawada.work/student_thumbnail.png"
        alt="student page"
        @click="() => handleTransition('/students')"
      />
      <span>Student</span>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/scss/mixin";
.container {
  display: block;
  @include mixin.mq(md) {
    display: flex;
  }
}
.children {
  margin: var(--space-6) auto;
  text-align: center;
  width: 90%;
  @include mixin.mq(md) {
    width: 40%;
  }
}
.image {
  width: 100%;
  height: 300px;
  background: orange;
  cursor: pointer;
  margin-bottom: var(--space-4);
  transform: scale(1);
  transition: all 0.3s;
  &:hover {
    transform: scale(1.05);
  }
}
</style>
