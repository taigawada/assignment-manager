import { computed, ref } from "vue";
import { useTransition, TransitionPresets } from "@vueuse/core";

export const useFocusBackdrop = () => {
  const source = ref(0);
  const transitions = useTransition(source, {
    duration: 140,
    delay: 100,
    transition: TransitionPresets.easeInOutCubic,
  });
  const outputStyles = computed(() => `${transitions.value}px`);
  const focusinFn = () => {
    source.value = 1.5;
  };
  const focusoutFn = () => {
    source.value = 0;
  };
  return {
    outputStyles,
    focusinFn,
    focusoutFn,
  };
};
