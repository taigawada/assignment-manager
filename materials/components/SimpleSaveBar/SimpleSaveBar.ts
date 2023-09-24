import "./SimpleSaveBar.scss";

import { defineComponent, h, PropType } from "vue";
import { SimpleButton } from "../SimpleButton";

interface Button {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onAction?: () => unknown;
}

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    saveButton: {
      type: Object as PropType<Button>,
      default: () => ({
        label: "保存",
      }),
    },
    discardButton: {
      type: Object as PropType<Button>,
      default: () => ({
        label: "破棄",
      }),
    },
    cardText: {
      type: String,
      default: "保存されていない変更",
      required: false,
    },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          class: [{ simple_save_bar__base: true }],
          style: [{ display: props.open ? "flex" : "none" }],
        },
        [
          h(
            "span",
            { class: [{ simple_save_bar__header_text: true }] },
            props.cardText
          ),
          h("div", { class: [{ simple_save_bar__buttons_container: true }] }, [
            h(
              SimpleButton,
              {
                normal: true,
                disabled: props.discardButton.disabled,
                loading: props.discardButton.loading,
                props: {
                  normal: true,
                  disabled: props.discardButton.disabled,
                  loading: props.discardButton.loading,
                },
                onClick: () =>
                  props.discardButton.onAction
                    ? props.discardButton.onAction()
                    : void 0,
                on: {
                  click: () =>
                    props.discardButton.onAction
                      ? props.discardButton.onAction()
                      : void 0,
                },
              },
              isVue3
                ? () => props.discardButton.label
                : props.discardButton.label
            ),
            h(
              SimpleButton,
              {
                primary: true,
                disabled: props.saveButton.disabled,
                loading: props.saveButton.loading,
                props: {
                  primary: true,
                  disabled: props.saveButton.disabled,
                  loading: props.saveButton.loading,
                },
                onClick: () =>
                  props.saveButton.onAction
                    ? props.saveButton.onAction()
                    : void 0,
                on: {
                  click: () =>
                    props.saveButton.onAction
                      ? props.saveButton.onAction()
                      : void 0,
                },
              },
              isVue3 ? () => props.saveButton.label : props.saveButton.label
            ),
          ]),
        ]
      );
  },
});
