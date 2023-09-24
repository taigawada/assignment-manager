import { defineComponent, ref, PropType, h, onUpdated, VNode } from "vue";
import { ArrowDown } from "../../icons.index";
import { SimplePopover } from "../SimplePopover";
import { SimpleButton } from "../SimpleButton";
import { useElementBounding } from "@vueuse/core";
import "./SimpleActions.scss";
interface Actions {
  label: string;
  onAction: () => unknown;
}
export default defineComponent({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    actions: {
      type: Array as PropType<Actions[]>,
      required: true,
    },
    primary: {
      type: Boolean,
      default: false,
      required: false,
    },
    normal: {
      type: Boolean,
      default: true,
      required: false,
    },
    plain: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props, context) {
    const activatorRef = ref<HTMLImageElement | null>(null);
    const activatorRect = useElementBounding(activatorRef);
    // @ts-ignore
    const refs = context.refs;
    const onClick = () => {
      context.emit("click:activator");
    };
    const handleClose = () => {
      context.emit("close");
    };
    // Vue2環境のみ、update時にrefを更新
    onUpdated(() => {
      if (!isVue3) {
        activatorRef.value = refs.activatorRef;
      }
    });
    const popoverContentNode = props.actions.map((action) => {
      return h(
        "div",
        {
          key: action.label,
          class: [{ simple_action__action_content: true }],
          on: { click: action.onAction },
          onClick: action.onAction,
        },
        action.label
      );
    });
    const popover = (): VNode => {
      return h(
        SimplePopover,
        {
          open: props.open,
          activatorRect: activatorRect,
          props: {
            open: props.open,
            activatorRect: activatorRect,
          },
          onClose: handleClose,
          on: {
            close: handleClose,
          },
        },
        isVue3 ? () => popoverContentNode : popoverContentNode
      );
    };
    return () =>
      h("div", [
        h(
          "div",
          {
            class: [{ simple_action__base: true }],
            ref: isVue3 ? activatorRef : "activatorRef",
          },
          [
            h(
              SimpleButton,
              {
                props: { normal: true, icon: ArrowDown },
                normal: true,
                icon: ArrowDown,
                onClick: onClick,
                on: {
                  click: onClick,
                },
              },
              // prettier-ignore
              isVue3
                            ? () => context.slots.default ? context.slots.default() : 'Actions'
                            : (context.slots.default ? context.slots.default() : 'Actions')
            ),
            popover(),
          ]
        ),
      ]);
  },
});
