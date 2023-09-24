import {
  defineComponent,
  PropType,
  h,
  onMounted,
  onUpdated,
  ref,
  watchEffect,
} from "vue";
import {
  ArrowDown,
  ArrowUp,
  DeleteCross,
  ExclamationMark,
} from "../../icons.index";
import { SimpleIcon } from "../SimpleIcon";
import "./SimpleInput.scss";
import { useFocusBackdrop } from "../compositions/useFocusBackdropAnimation";

type InputTypes = "text" | "email" | "password" | "number";

export default defineComponent({
  props: {
    type: {
      type: String as PropType<InputTypes>,
      default: "text",
      required: false,
    },
    step: {
      type: Number,
      default: 1,
      required: false,
    },
    maxlength: {
      type: Number,
      default: undefined,
      required: false,
    },
    width: {
      type: String,
      default: "auto",
      required: false,
    },
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: undefined,
      required: false,
    },
    icon: {
      type: String,
      default: "",
      required: false,
    },
    caption: {
      type: String,
      default: undefined,
      required: false,
    },
    captionHidden: {
      type: Boolean,
      required: false,
    },
    remove: {
      type: Boolean,
      required: false,
    },
    readonly: {
      type: Boolean,
      require: false,
    },
    error: {
      type: String,
      default: undefined,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    autofocus: {
      type: Boolean,
      required: false,
    },
  },
  setup(props, context) {
    const inputRef = ref<HTMLInputElement | null>(null);
    onMounted(() => {
      if (!isVue3) {
        // @ts-ignore
        inputRef.value = context.refs.inputRef;
      }
    });
    onUpdated(() => {
      if (!isVue3) {
        // @ts-ignore
        inputRef.value = context.refs.inputRef;
      }
    });
    watchEffect(() => {
      if (props.autofocus) {
        inputRef.value?.focus();
      }
    });
    const isFocus = ref(false);
    const { outputStyles, focusinFn, focusoutFn } = useFocusBackdrop();
    const handleRemove = () => {
      context.emit("remove");
    };
    const handleInputChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      context.emit("change", target.value);
    };
    const isNumber = () => {
      if (typeof Number(props.value) === "number") {
        return true;
      } else return false;
    };
    const handleNumberIncrease = () => {
      if (isNumber()) {
        const newNum = (Number(props.value) + 1 / props.step).toFixed(
          String(props.step).length - 1
        );
        context.emit("change", String(newNum));
      }
    };
    const handleNumberDecrease = () => {
      if (isNumber()) {
        const newNum = (Number(props.value) + 1 / props.step).toFixed(
          String(props.step).length - 1
        );
        context.emit("change", String(newNum));
      }
    };
    const handleValidation = (event: Event) => {
      event.stopPropagation();
    };
    const handleFocusin = () => {
      isFocus.value = true;
      focusinFn();
      context.emit("focusin");
    };
    const handleFocusout = () => {
      isFocus.value = false;
      focusoutFn();
      context.emit("focusout");
    };
    const appearRemoveButton = () => {
      if (props.value) {
        return props.remove && props.value.length > 0;
      } else {
        return false;
      }
    };
    const isError = (): boolean => {
      if (props.error) {
        return props.error.length > 0;
      } else {
        return false;
      }
    };
    const widthStyle = () => ({
      "--simple-input-width": props.width,
    });
    const captionNode = () => {
      if (!props.captionHidden) {
        return h(
          "div",
          {
            class: [
              {
                simple_input__caption_hidden: true,
                simple_input__caption: props.caption !== undefined,
              },
            ],
          },
          [props.caption === undefined ? "_" : props.caption]
        );
      }
    };
    const iconsNode = () => {
      if (props.type === "number") {
        return h("div", { class: [{ simple_input_number_handler: true }] }, [
          h(
            "div",
            {
              class: [{ simple_input_number_handler_box: true }],
              onClick: handleNumberIncrease,
              on: {
                click: handleNumberIncrease,
              },
            },
            [
              h(SimpleIcon, {
                source: ArrowUp,
                size: "6px",
                clickable: true,
                props: {
                  source: ArrowUp,
                  size: "6px",
                  clickable: true,
                },
              }),
            ]
          ),
          h(
            "div",
            {
              class: [{ simple_input_number_handler_box: true }],
              onClick: handleNumberDecrease,
              on: {
                click: handleNumberDecrease,
              },
            },
            [
              h(SimpleIcon, {
                source: ArrowDown,
                size: "6px",
                clickable: true,
                props: {
                  source: ArrowDown,
                  size: "6px",
                  clickable: true,
                },
              }),
            ]
          ),
        ]);
      } else if (props.maxlength) {
        return h(
          "span",
          { class: [{ simple_input__length_count: true }] },
          `${props.value ? props.value.length : 0}/${props.maxlength}`
        );
      } else if (appearRemoveButton()) {
        return h(SimpleIcon, {
          source: DeleteCross,
          size: "18px",
          fill: "var(--text)",
          clickable: true,
          props: {
            source: DeleteCross,
            size: "18px",
            fill: "var(--text)",
            clickable: true,
          },
          onClick: handleRemove,
          on: {
            click: handleRemove,
          },
        });
      } else {
        return h(SimpleIcon, {
          source: props.icon,
          size: "15px",
          fill: "var(--text)",
          props: {
            source: props.icon,
            size: "15px",
            fill: "var(--text)",
          },
        });
      }
    };
    const inputElementNode = () =>
      h("div", { class: [{ simple_input__input_field: true }] }, [
        h("div", {
          class: [{ text_input_focused_border_backdrop: true }],
          style: [{ "--outline-backdrop-weight": outputStyles.value }],
        }),
        h("input", {
          ref: isVue3 ? inputRef : "inputRef",
          class: [
            {
              simple_input__input_element: true,
              simple_input__disabled: props.disabled,
              simple_input__input_error: isError(),
            },
          ],
          style: [{ "padding-right": props.maxlength ? "60px" : "40px" }],
          type: props.type,
          maxlength: props.maxlength,
          disabled: props.disabled,
          readonly: props.readonly,
          placeholder: props.placeholder,
          value: props.value,
          domProps: {
            type: props.type,
            placeholder: props.placeholder,
            value: props.value,
          },
          attrs: {
            readonly: props.readonly,
            maxlength: props.maxlength,
            disabled: props.disabled,
          },
          onInput: (e: Event) => handleInputChange(e),
          onFocus: (event: Event) => {
            handleFocusin();
            event.preventDefault();
          },
          onBlur: (event: Event) => {
            handleFocusout();
            event.preventDefault();
          },
          onChange: (e: Event) => handleValidation(e),
          on: {
            input: (e: Event) => handleInputChange(e),
            focus: handleFocusin,
            blur: handleFocusout,
            change: (e: Event) => handleValidation(e),
          },
        }),
        [
          h("div", { class: [{ simple_input__icon_base: true }] }, [
            iconsNode(),
          ]),
        ],
      ]);
    const inputErrorNode = () => {
      if (isError()) {
        return h("div", { class: [{ simple_input__error_message: true }] }, [
          h(SimpleIcon, {
            class: [{ simple_input__error_exclamation: true }],
            source: ExclamationMark,
            size: "15px",
            fill: "rgba(255, 121, 121, 1)",
            props: {
              source: ExclamationMark,
              size: "15px",
              fill: "rgba(255, 121, 121, 1)",
            },
          }),
          [
            h(
              "span",
              { class: [{ simple_input__error_text: true }] },
              props.error
            ),
          ],
        ]);
      }
    };
    return () =>
      h(
        "div",
        { class: [{ simple_input__container: true }], style: [widthStyle()] },
        [
          h("div", [captionNode()]),
          h("div", [inputElementNode()]),
          h("div", [inputErrorNode()]),
        ]
      );
  },
});
