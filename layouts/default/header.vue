<script setup lang="ts">
import { SimpleSelector, SimpleStack } from "@materials";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  sidebar: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits<{
  (e: "toggleOpen"): void;
  (e: "logout"): void;
}>();
const handleBarsClick = () => {
  emits("toggleOpen");
};
const isLauguageSelectorShow = computed(
  () =>
    route.path.startsWith("/students") || route.path === "/teachers/preview",
);
</script>
<template>
  <div class="header-wrapper">
    <fa
      v-show="props.sidebar"
      class="menu-bar"
      icon="bars"
      size="1x"
      @click="handleBarsClick"
    />
    <span
      v-show="!isLauguageSelectorShow || !$isMobile.value"
      class="header-text"
      >提出物管理/portfolio</span
    >
    <SimpleStack distribution="right" alignment="center">
      <div v-show="isLauguageSelectorShow" class="language-selector">
        <span class="language-selector-caption">言語設定</span>
        <SimpleSelector
          :value="$grade.value"
          :items="[
            { label: '小学1年生', value: 'grade1' },
            { label: '小学2年生', value: 'grade2' },
            { label: '小学3年生', value: 'grade3' },
            { label: '小学4年生', value: 'grade4' },
            { label: '小学5年生', value: 'grade5' },
            { label: '小学6年生', value: 'grade6' },
            { label: '小学6年生以上', value: 'all' },
          ]"
          @change="$changeGrade"
        ></SimpleSelector>
      </div>
      <fa
        v-show="!$isMobile.value"
        icon="arrow-right-from-bracket"
        size="1x"
        title="logout"
        class="logout"
        @click="() => emits('logout')"
      />
    </SimpleStack>
  </div>
</template>
<style lang="scss" scoped>
@use "@/scss/mixin";
.header-wrapper {
  margin: var(--space-2) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.language-selector {
  margin-right: 0;
  display: block;
  align-items: center;
  @include mixin.mq(lg) {
    margin-right: var(--space-6);
    display: inline-flex;
    align-items: center;
  }
}
.language-selector-caption {
  white-space: nowrap;
  margin-right: var(--space-2);
  font-size: var(--font-size-3);
}
.menu-bar {
  @include mixin.clickable;
  color: bar(--text);
}
.header-text {
  font-size: var(--font-size-8);
  text-align: center;
}
.logout {
  color: var(--text);
  cursor: pointer;

  &:hover {
    color: var(--selected);
    transform: scale(1.05);
  }
}
</style>
