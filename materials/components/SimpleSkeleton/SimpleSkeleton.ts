import { defineComponent, computed, h, PropType } from "vue";
import "./SimpleSkeleton.scss";

export default defineComponent({
  props: {
    display: {
      type: String as PropType<"inline" | "block">,
      default: "block",
      required: false,
    },
    distribution: {
      type: String as PropType<"left" | "center" | "right">,
      default: "center",
      required: false,
    },
    size: {
      type: Object as PropType<{ width: string; height: string }>,
      default: () => ({ width: "100px", height: "15px" }),
      required: false,
    },
    type: {
      type: String as PropType<"text" | "rect">,
      default: "rect",
      required: false,
    },
    round: {
      type: Boolean,
    },
    lines: {
      type: Number,
      default: 1,
      required: false,
    },
  },
  setup(props) {
    const skeletonStyles = computed(() => ({
      "--simple-skeleton-rect-width": props.size.width,
      "--simple-skeleton-rect-height": props.size.height,
      "--simple-skeleton-rounded": props.round
        ? "50vh"
        : "var(--border-radius-1)",
      "--simple-skeleton-rect-display":
        props.display === "inline" ? "inline-block" : "block",
      "--simple-skeleton-rect-margin-left":
        props.distribution !== "left" ? "auto" : "0",
      "--simple-skeleton-rect-margin-right":
        props.distribution !== "right" ? "auto" : "0",
    }));
    const rectNode = () =>
      h("div", {
        class: [{ simple_skeleton__rect: true }],
        style: [skeletonStyles.value],
      });
    const textLineNode = () => [
      ...[...new Array(props.lines - 1).keys()].map(() =>
        h("div", {
          class: [{ simple_skeleton__text_line: true }],
        })
      ),
      h("div", {
        class: [{ simple_skeleton__text_line_short: true }],
        style: [{ marginLeft: props.lines === 1 ? "auto" : "0" }],
      }),
    ];

    const skeletonNode = () => {
      if (props.type === "rect") return rectNode();
      else return textLineNode();
    };
    return () =>
      h(
        "div",
        {
          class: [{ simple_skeleton__base: true }],
          style: [{ display: props.display }],
        },
        [skeletonNode()]
      );
  },
});
