import { defineComponent, toRefs, h } from "vue";
import { useTransition, TransitionPresets } from "@vueuse/core";

import "./SimpleProgressBar.scss";

export default defineComponent({
  props: {
    progress: {
      type: Number,
      default: 0,
      required: true,
    },
    duration: {
      type: Number,
      default: 300,
      required: false,
    },
    delay: {
      type: Number,
      default: 0,
      required: false,
    },
    animation: {
      type: Boolean,
    },
  },
  setup(props) {
    const { progress } = toRefs(props);

    const output = useTransition(progress, {
      duration: props.duration,
      delay: props.delay,
      disabled: props.animation,
      transition: TransitionPresets.easeInOutCubic,
    });
    return () =>
      h("div", { class: [{ simple_progressbar_base: true }] }, [
        h("div", {
          class: [{ simple_progressbar__progress: true }],
          style: [{ width: `${output.value}%` }],
        }),
      ]);
  },
});
