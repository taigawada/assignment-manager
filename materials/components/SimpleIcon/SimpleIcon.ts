import { defineComponent, h } from "vue";
import "./SimpleIcon.scss";

export default defineComponent({
  props: {
    source: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "16px",
      required: false,
    },
    fill: {
      type: String,
      default: "var(--text)",
      required: false,
    },
    clickable: {
      type: Boolean,
      required: false,
    },
  },
  setup(props, context) {
    const handleIconClick = (event: Event) => {
      context.emit("click", event);
    };
    return () =>
      h("svg", {
        class: [{ simpleIconBase: true }],
        style: [
          { width: props.size },
          { height: props.size },
          { fill: props.fill },
          { cursor: props.clickable ? "pointer" : "default" },
        ],
        innerHTML: props.source,
        domProps: { innerHTML: props.source },
        // Vue2環境のみ、clickイベントが発火しないのでこのコンポーネントから伝播させる
        on: {
          click: (e: Event) => handleIconClick(e),
        },
      });
  },
});
