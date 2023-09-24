import { defineComponent, h, PropType } from "vue";
import "./SimpleSpinner.scss";
type Size = "tiny" | "normal" | "large";
export default defineComponent({
  props: {
    size: {
      type: String as PropType<Size>,
      default: "normal",
      required: false,
    },
    color: {
      type: Array as PropType<number[]>,
      default: () => [255, 194, 85],
      required: false,
    },
  },
  setup(props) {
    const styles = () => {
      let size = "2.5em";
      if (props.size === "tiny") {
        size = "1.5em";
      } else if (props.size === "large") {
        size = "5em";
      } else {
        size = "2.5em";
      }
      let borderWeight = "0.4em";
      if (props.size === "tiny") {
        borderWeight = "0.2em";
      } else if (props.size === "large") {
        borderWeight = "0.5em";
      } else {
        borderWeight = "0.4em";
      }
      return {
        "--spinner-color": `rgb(${props.color[0]}, ${props.color[1]}, ${props.color[2]})`,
        "--spinner-color-alpha": `rgba(${props.color[0]}, ${props.color[1]}, ${props.color[2]}, 0.2)`,
        "--spinner-size": size,
        "--spinner-border-weight": borderWeight,
      };
    };
    return () =>
      h("div", {
        class: [{ simple_spinner__loader: true }],
        style: [styles()],
      });
  },
});
