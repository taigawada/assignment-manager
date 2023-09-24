<script setup lang="ts">
const nuxt = useNuxtApp();

interface Nav {
  label: string;
  url: string;
  external?: boolean;
}
const nav: Nav[] = [
  {
    label: "教師側ページ",
    url: "/teachers",
  },
  {
    label: "生徒側ページ",
    url: "/students",
  },
  {
    label: "GitHub",
    url: "https://github.com",
    external: true,
  },
];
const emits = defineEmits<{
  (e: "transition"): void;
  (e: "logout"): void;
}>();
const handleNavClick = (url: string, external: boolean) => {
  emits("transition");
  if (external) {
    navigateTo(url, {
      external: true,
    });
  } else {
    navigateTo(url);
  }
};
</script>
<template>
  <div class="nav-container">
    <div v-for="content in nav" :key="content.label" class="nav-list">
      <span
        class="navListSelected"
        :class="{ navListSelectedHidden: $route.path.startsWith(content.url) }"
      ></span>
      <div
        class="nav-list-content"
        @click="() => handleNavClick(content.url, !!content.external)"
      >
        <span class="nav-list-text">{{ content.label }}</span>
        <fa
          v-if="content.external"
          icon="up-right-from-square"
          size="1x"
          :style="{ color: 'var(--text)' }"
        />
      </div>
    </div>
    <div v-show="$isMobile.value" class="nav-list logout">
      <span class="navListSelected"></span>
      <div class="nav-list-content" @click="() => emits('logout')">
        <span class="nav-list-text">Logout</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "@/scss/mixin";
.nav-container {
  padding-top: var(--space-4);
  padding-right: var(--space-2);
}
.nav-list {
  @include mixin.clickable;
  display: flex;
  width: 100%;
  margin: var(--space-3) 0;
}
.nav-list-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: var(--space-2) 0;
  margin-left: var(--space-2);
  padding-left: var(--space-2);
  border-radius: var(--border-radius-1);
}
.nav-list-text {
  margin-right: var(--space-4);
}
.nav-list-content:hover {
  background: var(--normal-hovered);
}
.navListSelected {
  background: var(--primary);
  width: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  visibility: hidden;
}
.navListSelectedHidden {
  visibility: visible;
}
.logout {
  padding-top: var(--space-3);
}
</style>
