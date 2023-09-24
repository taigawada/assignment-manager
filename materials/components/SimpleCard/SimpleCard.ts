import { defineComponent, PropType, h } from "vue";
import { SimpleButton } from "../SimpleButton";
import "./SimpleCard.scss";

interface Action {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onAction?: () => unknown;
}
export default defineComponent({
  props: {
    width: {
      type: String,
      default: "100%",
      require: false,
    },
    mainAction: {
      type: Object as PropType<Action>,
      default: () => ({
        label: "",
        disabled: false,
        loading: false,
      }),
      require: false,
    },
    subAction: {
      type: Object as PropType<Action>,
      default: () => ({
        label: "",
        disabled: false,
        loading: false,
      }),
      require: false,
    },
  },
  setup(props, context) {
    const hundleMainActionClick = () => {
      if (props.mainAction.onAction) {
        props.mainAction.onAction();
      } else {
        context.emit("mainAction");
      }
    };
    const hundleSubActionClick = () => {
      if (props.subAction.onAction) {
        props.subAction.onAction();
      } else {
        context.emit("subAction");
      }
    };
    const cardWidth = () => ({
      "--card-width": props.width,
    });
    const mainActionNode = () =>
      h(
        SimpleButton,
        {
          primary: true,
          disabled: props.mainAction.disabled,
          loading: props.mainAction.loading,
          props: {
            primary: true,
            disabled: props.mainAction.disabled,
            loading: props.mainAction.loading,
          },
          onClick: hundleMainActionClick,
          on: {
            click: hundleMainActionClick,
          },
        },
        isVue3 ? () => props.mainAction.label : props.mainAction.label
      );
    const subActionNode = () =>
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
          onClick: hundleSubActionClick,
          on: {
            click: hundleSubActionClick,
          },
        },
        isVue3 ? () => props.subAction.label : props.subAction.label
      );
    const actionsNode = () =>
      h("div", { class: [{ simple_card__actions: true }] }, [
        props.subAction.label.length > 0 ? subActionNode() : undefined,
        props.subAction.label.length > 0 ? mainActionNode() : undefined,
      ]);
    return () =>
      h("div", { class: [{ simple_card__base: true }], style: [cardWidth()] }, [
        context.slots.default ? context.slots.default() : undefined,
        props.mainAction !== undefined || props.subAction !== undefined
          ? actionsNode()
          : undefined,
      ]);
  },
});
