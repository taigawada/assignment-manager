import { computed, defineComponent, h } from "vue";
import { CloseCross } from "../../icons.index";
import { SimpleIcon } from "../SimpleIcon";
import "./SimpleTag.scss";
export default defineComponent({
  props: {
    normal: {
      type: Boolean,
      default: true,
    },
    success: {
      type: Boolean,
    },
    processing: {
      type: Boolean,
    },
    warn: {
      type: Boolean,
    },
    dark: {
      type: Boolean,
    },
    critical: {
      type: Boolean,
    },
    remove: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const hundleClickRemove = () => {
      context.emit("remove");
    };
    const badgeColor = computed(() => {
      if (props.success) return "rgba(174, 233, 209, 1)";
      else if (props.processing) return "rgba(164, 232, 242, 1)";
      else if (props.critical) return "rgba(255, 121, 121, 1)";
      else if (props.warn) return "rgba(255, 178, 54, 1)";
      else if (props.dark) return "rgba(228, 229, 231, 1)";
      else return "rgba(253, 255, 255, 1)";
    });
    const textColor = computed(() => {
      if (props.success) return "rgba(44, 62, 80, 1)";
      else if (props.processing) return "rgba(44, 62, 80, 1)";
      else if (props.critical) return "rgba(255, 255, 255, 1)";
      else if (props.warn) return "rgba(44, 62, 80, 1)";
      else if (props.dark) return "rgba(44, 62, 80, 1)";
      else return "rgba(44, 62, 80, 1)";
    });
    return () =>
      h(
        "div",
        {
          class: [{ simple_tag__base: true }],
          style: [{ "--tag-surface-color": badgeColor.value }],
        },
        [
          h(
            "span",
            {
              class: [{ simple_tag__text: true }],
              style: [{ "--tag-text-color": textColor.value }],
            },
            context.slots.default ? context.slots.default() : undefined
          ),
          /* eslint-disable */
          props.remove
            ? h(SimpleIcon, {
                class: [{ simple_tag__remove_icon: true }],
                source: CloseCross,
                size: "12px",
                fill: textColor.value,
                clickable: true,
                props: {
                  source: CloseCross,
                  size: "12px",
                  fill: textColor.value,
                  clickable: true,
                },
                onClick: hundleClickRemove,
                on: {
                  click: hundleClickRemove,
                },
              })
            : undefined,
          /* eslint-enable */
        ]
      );
  },
});
