import {
  defineComponent,
  ref,
  PropType,
  h,
  VNode,
  VNodeNormalizedChildren,
  computed,
} from "vue";
import { SimpleSpinner } from "../SimpleSpinner";
import { SimpleIcon } from "../SimpleIcon";
import "./SimpleButton.scss";

export default defineComponent({
  props: {
    primary: {
      type: Boolean,
      required: false,
    },
    normal: {
      type: Boolean,
      required: false,
    },
    critical: {
      type: Boolean,
      required: false,
    },
    plain: {
      type: Boolean,
      required: false,
    },
    criticalPlain: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
    },
    url: {
      type: String,
      default: undefined,
      required: false,
    },
    external: {
      type: Boolean,
      required: false,
    },
    fill: {
      type: Boolean,
      required: false,
    },
    size: {
      type: Number,
      default: 10,
      required: false,
    },
    icon: {
      type: String,
      default: undefined,
      required: false,
    },
    textColor: {
      type: String,
      default: undefined,
      required: false,
    },
    iconSide: {
      type: String as PropType<"left" | "right">,
      default: "right",
      required: false,
    },
  },
  setup(props, context) {
    const isEntered = ref(false);
    const handleClick = () => {
      context.emit("click");
    };
    const mousedown = (): void => {
      isEntered.value = true;
    };
    const mouseup = (): void => {
      isEntered.value = false;
    };
    const mouseenter = (): void => {
      isEntered.value = true;
    };
    const mouseleave = (): void => {
      isEntered.value = false;
    };
    const sizeToPixel = computed(() => ({
      "--props-size": `${props.size + "px"}`,
    }));
    const textLengthVar = computed(() => {
      const textChildren = (): VNodeNormalizedChildren | string => {
        if (isVue3) {
          return context.slots.default
            ? context.slots.default()[0].children
            : "";
        } else {
          // @ts-ignore
          return context.slots.default ? context.slots.default()[0].text : "";
        }
      };
      let textLength = 0;
      const textChildrenRaw = textChildren();
      if (typeof textChildrenRaw === "string") {
        textLength = textChildrenRaw.replace(/ /g, "").length;
      }
      if (!props.fill) textLength = 0;
      return {
        "--slot-text-length": textLength,
      };
    });
    const target = computed(() => (props.external ? "_blank" : "_self"));
    const iconColor = computed(() => {
      if (props.textColor) return props.textColor;
      else if (props.critical || props.primary) return "var(--critical-text)";
      else if (props.normal) return "var(--normal-text)";
      else if (props.criticalPlain) return "var(--critical-plain)";
      else if (props.plain) return "var(--plain)";
      else return "var(--text)";
    });
    const spinnerColor = computed(() => {
      if (props.primary) return [255, 255, 85];
      else if (props.normal) return [105, 105, 105];
      else if (props.critical) return [255, 121, 121];
      else return [255, 194, 85];
    });
    const fillStyle = computed(() => ({
      "--filled-width": props.fill ? "100%" : "auto",
    }));
    const sideSwitch = (domArray: unknown[]): VNode[] => {
      if (props.iconSide === "left") {
        return domArray.reverse() as VNode[];
      } else {
        return domArray as VNode[];
      }
    };
    const disabledButtonNode = () => {
      return h(
        "a",
        {
          class: [
            {
              simple_button__disable_prime: props.primary,
              simple_button__disable_normal: props.normal,
              simple_button__disable_critical: props.critical,
              simple_button__disable_plain: props.plain,
              simple_button__disable_criticalPlain: props.criticalPlain,
            },
          ],
          style: [sizeToPixel.value],
        },
        [
          h(
            "a",
            {
              class: [
                {
                  simple_button__disabled_text:
                    !props.plain || !props.criticalPlain,
                  simple_button__disabled_text_primary:
                    props.primary || props.critical,
                },
              ],
              style: [textLengthVar.value],
              fill: props.fill,
              attrs: {
                fill: props.fill,
              },
            },
            sideSwitch([
              h(
                "span",
                context.slots.default ? context.slots.default() : "Button"
              ),
              props.icon
                ? /* eslint-disable */
                  h(SimpleIcon, {
                    props: {
                      source: props.icon,
                      size: props.size + "px",
                      fill: iconColor.value,
                      clickable: true,
                    },
                    source: props.icon,
                    size: props.size + "px",
                    fill: iconColor.value,
                    clickable: true,
                  })
                : undefined,
              /* eslint-enable */
            ])
          ),
        ]
      );
    };
    const loadingSpinnerNode = (): VNode | undefined => {
      if (!props.plain || !props.criticalPlain) {
        return h(SimpleSpinner, {
          size: "normal",
          color: spinnerColor.value,
          props: { size: "normal", color: spinnerColor.value },
        });
      }
    };
    const loadingButtonNode = () => {
      return h(
        "a",
        {
          class: [
            {
              simple_button__disable_prime: props.primary,
              simple_button__disable_normal: props.normal,
              simple_button__disable_critical: props.critical,
              simple_button__disable_plain: props.plain,
              simple_button__disable_criticalPlain: props.criticalPlain,
            },
          ],
          style: [sizeToPixel.value],
        },
        [
          h(
            "a",
            {
              class: [
                {
                  simple_button__text_loading:
                    !props.plain || !props.criticalPlain,
                },
              ],
              style: [textLengthVar.value],
              fill: props.fill,
              attrs: {
                fill: props.fill,
              },
            },
            sideSwitch([
              h(
                "span",
                context.slots.default ? context.slots.default() : "Button"
              ),
              props.icon
                ? /* eslint-disable */
                  h(SimpleIcon, {
                    props: {
                      source: props.icon,
                      size: props.size + "px",
                      fill: iconColor.value,
                      clickable: true,
                    },
                    source: props.icon,
                    size: props.size + "px",
                    fill: iconColor.value,
                    clickable: true,
                  })
                : undefined,
              /* eslint-enable */
            ])
          ),
          h("div", { class: [{ simple_button__spinner: true }] }, [
            loadingSpinnerNode(),
          ]),
        ]
      );
    };
    const buttonElement: object = {
      attr: { href: props.url, target: target.value },
      onMouseenter: mouseenter,
      onMouseleave: mouseleave,
      onMousedown: mousedown,
      onMouseup: mouseup,
      on: {
        mouseenter: mouseenter,
        mouseleave: mouseleave,
        mousedown: mousedown,
        mouseup: mouseup,
        click: handleClick,
      },
    };
    const buttonNode = (): VNode | undefined => {
      return h(
        "a",
        {
          class: [
            {
              simple_button__base_prime: props.primary,
              simple_button__entered_prime: props.primary && isEntered.value,
              simple_button__base_normal: props.normal,
              simple_button__entered_normal: props.normal && isEntered.value,
              simple_button__base_critical: props.critical,
              simple_button__entered_critical:
                props.critical && isEntered.value,
            },
          ],
          style: [sizeToPixel.value],
          ...buttonElement,
        },
        [
          h(
            "a",
            {
              class: [
                {
                  simple_button__text_normal: props.normal,
                  simple_button__text_prime: props.primary,
                  simple_button__text_critical: props.critical,
                },
              ],
              style: [textLengthVar.value],
              fill: props.fill,
              attrs: {
                fill: props.fill,
              },
            },
            sideSwitch([
              h(
                "span",
                context.slots.default ? context.slots.default() : "Button"
              ),
              props.icon
                ? /* eslint-disable */
                  h(SimpleIcon, {
                    props: {
                      source: props.icon,
                      size: props.size + "px",
                      fill: iconColor.value,
                      clickable: true,
                    },
                    source: props.icon,
                    size: props.size + "px",
                    fill: iconColor.value,
                    clickable: true,
                  })
                : undefined,
              /* eslint-enable */
            ])
          ),
        ]
      );
    };
    const plainButtonNode = (): VNode | undefined => {
      return h(
        "a",
        {
          class: [
            {
              simple_button__base_plain: props.plain,
              simple_button__entered_plain: isEntered.value && props.plain,
              simple_button__base_criticalPlain: props.criticalPlain,
              simple_button__entered_criticalPlain:
                isEntered.value && props.criticalPlain,
            },
          ],
          style: [sizeToPixel.value],
          ...buttonElement,
        },
        sideSwitch([
          h("span", context.slots.default ? context.slots.default() : "Button"),
          props.icon
            ? /* eslint-disable */
              h(SimpleIcon, {
                props: {
                  source: props.icon,
                  size: props.size + "px",
                  fill: iconColor.value,
                  clickable: true,
                },
                source: props.icon,
                size: props.size + "px",
                fill: iconColor.value,
                clickable: true,
              })
            : undefined,
          /* eslint-enable */
        ])
      );
    };
    const button = (): VNode | undefined => {
      if (props.disabled) {
        return disabledButtonNode();
      } else if (props.loading) {
        return loadingButtonNode();
      } else if (props.plain || props.criticalPlain) {
        return plainButtonNode();
      } else {
        return buttonNode();
      }
    };
    return () =>
      h(
        "div",
        {
          class: [{ simple_button__container: true }],
          style: [Object.assign(sizeToPixel.value, fillStyle.value)],
        },
        [button()]
      );
  },
});
