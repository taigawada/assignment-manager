<script setup lang="ts">
import { SimpleIcon } from "@materials";
import { CheckMark, CloseCross } from "@materials/icons";
import { useElementBounding } from "@vueuse/core";

const props = defineProps({
  disabled: {
    type: Boolean,
  },
  isSubmitted: {
    type: Boolean,
    required: true,
  },
  onSubmit: {
    type: Function as PropType<() => Promise<unknown>>,
    required: true,
  },
  onSubmitCancel: {
    type: Function as PropType<() => Promise<unknown>>,
    required: true,
  },
});
const emits = defineEmits<{
  (e: "success", result: any): void;
  (e: "failed", error: any): void;
}>();
const buttonRef = ref<HTMLElement | null>(null);
const { width } = useElementBounding(buttonRef);
const resultIcon = ref<string>(CheckMark);
const isIconShow = ref(false);
const isTextShow = ref(false);
const isDisabled = ref(false);
const isLoading = ref(false);
const isFailed = ref(false);
const sleep = (waitTime: number) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));
const buttonColor = computed(() => ({
  "--button-filled-color": props.isSubmitted
    ? "rgba(255, 121, 121, 1)"
    : "rgba(255, 155, 85, 1)",
  "--button-failed-filled-error": isFailed.value
    ? "rgba(255, 121, 121, 1)"
    : "rgba(255, 155, 85, 1)",
}));
const handleMousedown = async () => {
  if (!isDisabled.value && !props.disabled) {
    isDisabled.value = true;
    await sleep(400);
    isTextShow.value = true;
    isLoading.value = true;
    const actionFn = props.isSubmitted ? props.onSubmitCancel : props.onSubmit;
    try {
      const result = await actionFn();
      emits("success", result);
      resultIcon.value = CheckMark;
      isIconShow.value = true;
      isLoading.value = false;
      await sleep(1600);
      isIconShow.value = false;
      isTextShow.value = false;
      isDisabled.value = false;
    } catch (e) {
      emits("failed", e);
      resultIcon.value = CloseCross;
      isIconShow.value = true;
      isFailed.value = true;
      isLoading.value = false;
      await sleep(1600);
      isFailed.value = false;
      isTextShow.value = false;
      isIconShow.value = false;
      isDisabled.value = false;
    }
  }
};
</script>
<template>
  <div class="submit-button-container">
    <a
      ref="buttonRef"
      class="submit-button"
      :class="{ 'submit-button-clicked': isLoading }"
      :style="{
        pointerEvents: isDisabled ? 'none' : 'auto',
        cursor: isDisabled ? 'auto' : 'pointer',
        ...buttonColor,
      }"
      @mousedown="handleMousedown"
    >
      <span
        class="submit-button-hover-filler"
        :style="{
          '--parent-width': width + 'px',
          ...buttonColor,
        }"
        :class="{
          'submit-button-hover-filler-hovered': isDisabled && !isLoading,
          'submit-button-hover-filler-clicked': isLoading,
        }"
      ></span>
      <span
        class="submit-button--text"
        :class="{ 'submit-button--text-hovered': isDisabled }"
        :style="buttonColor"
      >
        <span v-show="!isTextShow">{{
          isSubmitted ? $t("submitCancel") : $t("selfSubmitCheck")
        }}</span>
        <SimpleIcon
          v-show="isIconShow"
          class="submit-button-check-icon"
          :source="resultIcon"
          fill="#fdffff"
        ></SimpleIcon>
      </span>
      <div v-if="isLoading" class="submit-button--spinner-container">
        <div class="submit-button--spinner" :style="buttonColor"></div>
      </div>
    </a>
  </div>
</template>
<style lang="scss" scoped>
$button-width: 300px;
$button-height: 42px;
$delay: 400ms;
.submit-button-container {
  position: relative;
  width: $button-width;
  text-align: center;
  left: 100%;
  transform: translateX(-100%);
  margin: var(--space-1) 0;
}
.submit-button {
  position: relative;
  display: inline-block;
  width: $button-width;
  height: $button-height;
  margin: 0 auto;
  border-radius: 100vh;
  border: 1px solid var(--button-filled-color);
  text-decoration: none;
  box-shadow: var(--box-shadow-1);
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  transition: all $delay ease;
}
.submit-button-clicked {
  border: 1px solid rgba(0, 0, 0, 0);
  width: $button-width;
  box-shadow: none;
  transform: scale(1.04);
}
.submit-button--text {
  font-size: var(--font-size-4);
  padding: var(--space-4) var(--space-4);
  line-height: 40px;
  color: var(--button-filled-color);
  text-decoration: none;
  pointer-events: none;
}
.submit-button--text-hovered {
  color: rgba(255, 255, 255, 1);
}
.submit-button-check-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.submit-button-hover-filler {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 0px;
  height: 0px;
  border-radius: 50%;
  background: var(--button-failed-filled-error);
  z-index: -1;
  transition: all 400ms ease;
}
.submit-button-hover-filler-clicked {
  left: 50%;
  transition: all $delay ease 200ms;
}
.submit-button-hover-filler-hovered {
  width: calc(var(--parent-width) * 2);
  height: calc(var(--parent-width) * 2);
}
.submit-button--spinner-container {
  position: absolute;
  left: 50%;
  top: 58%;
  transform: translate(-50%, -50%);
  z-index: -2;
}
$spinner-size: 32px;
$border-weight: 4px;
$border-color: var(--primary);
$border-color-alpha: var(--theme-color-alpha);
.submit-button--spinner:after,
.submit-button--spinner {
  color: #2c3e50;
  border-radius: 50%;
  width: $spinner-size;
  height: $spinner-size;
}

.submit-button--spinner {
  display: inline-block;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: $border-weight solid var(--theme-color-alpha);
  border-right: $border-weight solid var(--theme-color-alpha);
  border-bottom: $border-weight solid var(--theme-color-alpha);
  border-left: $border-weight solid $border-color;
  transform: translateZ(0);
  animation: SpinnerRotateAnim 0.7s infinite linear;
}
@keyframes SpinnerRotateAnim {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
