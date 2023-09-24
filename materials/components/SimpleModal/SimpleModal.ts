import { defineComponent, ref, watchEffect, PropType, h } from "vue";
import { useScrollLock, onKeyStroke, onKeyPressed } from "@vueuse/core";
import { CloseCross } from "../../icons.index";
import { SimpleButton } from "../SimpleButton";
import { SimpleIcon } from "../SimpleIcon";
import "./SimpleModal.scss";
interface MainAction {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  isCritical?: boolean;
  onAction?: () => unknown;
}
interface SubAction {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  onAction?: () => unknown;
}
export default defineComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: null,
      required: false,
    },
    mainAction: {
      type: Object as PropType<MainAction>,
      default: null,
      required: false,
    },
    subAction: {
      type: Object as PropType<SubAction>,
      default: null,
      required: false,
    },
  },
  setup(props, context) {
    if (!document) return () => {};
    const documentRef = ref(document.documentElement);
    const scrollLock = useScrollLock(documentRef);
    const onMainAction = () => {
      if (props.mainAction.onAction) {
        props.mainAction.onAction();
      } else {
        context.emit("mainAction");
      }
    };
    const onSubAction = () => {
      if (props.subAction.onAction) {
        props.subAction.onAction();
      } else {
        context.emit("subAction");
      }
    };
    const handleDestroy = () => {
      context.emit("destroy");
    };
    onKeyPressed(["Enter"], () => {
      if (props.open === true) onMainAction();
    });
    onKeyPressed(["Escape"], () => {
      if (props.open === true) handleDestroy();
    });
    onKeyStroke(["Tab"], (e) => {
      if (props.open === true) e.preventDefault();
    });
    watchEffect(() => {
      if (props.open === true) {
        scrollLock.value = true;
      } else {
        scrollLock.value = false;
      }
    });
    const headerNode = () =>
      h("div", { class: [{ simple_modal__card_header: true }] }, [
        h("div", { class: [{ simple_modal__card_title: true }] }, props.title),
        h(SimpleIcon, {
          class: [{ simple_modal__close_icon: true }],
          source: CloseCross,
          size: "24px",
          fill: "var(--text)",
          clickable: true,
          props: {
            source: CloseCross,
            size: "24px",
            fill: "var(--text)",
            clickable: true,
          },
          onClick: handleDestroy,
          on: { click: handleDestroy },
        }),
      ]);
    const contentNode = () =>
      h(
        "div",
        { class: [{ simple_modal__content_container: true }] },
        context.slots.default ? context.slots.default() : ""
      );
    const footerNode = () =>
      h("div", { class: [{ simple_modal__card_footer: true }] }, [
        h("div", { class: [{ simple_modal__card_actions: true }] }, [
          h(
            SimpleButton,
            {
              normal: true,
              disabled: props.subAction.disabled,
              loading: props.subAction.loading,
              props: {
                normal: true,
                disabled: props.subAction.disabled,
                loading: props.subAction.loading,
              },
              onClick: onSubAction,
              on: {
                click: onSubAction,
              },
            },
            isVue3 ? () => props.subAction.text : props.subAction.text
          ),
          h(
            SimpleButton,
            {
              primary: props.mainAction.isCritical ? false : true,
              critical: props.mainAction.isCritical ? true : false,
              disabled: props.mainAction.disabled,
              loading: props.mainAction.loading,
              props: {
                primary: props.mainAction.isCritical ? false : true,
                critical: props.mainAction.isCritical ? true : false,
                disabled: props.mainAction.disabled,
                loading: props.mainAction.loading,
              },
              onClick: onMainAction,
              on: {
                click: onMainAction,
              },
            },
            isVue3 ? () => props.mainAction.text : props.mainAction.text
          ),
        ]),
      ]);
    const mainNode = () => {
      if (props.open) {
        return h("div", { class: [{ simple_modal__overlay: true }] }, [
          h("div", { class: [{ simple_modal__card: true }] }, [
            headerNode(),
            contentNode(),
            props.mainAction !== undefined || props.subAction !== undefined
              ? footerNode()
              : null,
          ]),
        ]);
      } else {
        return h("div");
      }
    };
    return () => mainNode();
  },
});
