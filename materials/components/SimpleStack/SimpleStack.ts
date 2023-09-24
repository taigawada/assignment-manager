import { defineComponent, PropType, h } from "vue";
import "./SimpleStack.scss";

export default defineComponent({
  props: {
    spacing: {
      type: String,
      default: "5px",
      required: false,
    },
    vertical: {
      type: Boolean,
      required: false,
    },
    alignment: {
      type: String as PropType<"lower" | "center" | "upper">,
      default: "center",
      required: false,
    },
    distribution: {
      type: String as PropType<
        "left" | "center" | "right" | "spaceBetween" | "spaceAround"
      >,
      default: "center",
      required: false,
    },
    wrap: {
      type: Boolean,
      required: false,
    },
  },
  setup(props, context) {
    const alignment = () => {
      switch (props.alignment) {
        case "center":
          return "center";
        case "upper":
          return "flex-start";
        case "lower":
          return "flex-end";
      }
    };
    const distribution = () => {
      switch (props.distribution) {
        case "left":
          return "start";
        case "center":
          return "center";
        case "right":
          return "end";
        case "spaceBetween":
          return "space-between";
        case "spaceAround":
          return "space-around";
      }
    };
    const styles = () => ({
      "--align-items": alignment(),
      "--justify-content": distribution(),
      "--flex-direction-wrap": `${props.vertical ? "column" : "row"} ${
        props.wrap ? "wrap" : "nowrap"
      }`,
    });
    const spacingStyle = () => {
      if (props.vertical) {
        return { margin: `${props.spacing} 0` };
      } else {
        return { margin: `0 ${props.spacing}` };
      }
    };
    return () =>
      h("div", { class: [{ simple_stack__base: true }], style: [styles()] }, [
        context.slots.default
          ? context.slots.default({ spacing: spacingStyle() })
          : undefined,
      ]);
  },
});
