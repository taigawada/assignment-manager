import {
  defineComponent,
  h,
  VNode,
  getCurrentInstance,
  ref,
  computed,
  toRefs,
  watch,
} from "vue";
import { CheckMark, HyphenBar } from "../../icons.index";
import { SimpleIcon } from "../SimpleIcon";
import { useTransition, TransitionPresets } from "@vueuse/core";
import "./SimpleCheckbox.scss";
export default defineComponent({
  props: {
    label: {
      type: String,
      default: undefined,
      required: false,
    },
    value: {
      type: Boolean,
      required: true,
    },
    indeterminate: {
      type: Boolean,
      required: false,
    },
    size: {
      type: String,
      default: "17px",
      required: false,
    },
  },
  setup(props, context) {
    const source = ref(props.value ? 1 : 0);
    const transitions = useTransition(source, {
      duration: 150,
      delay: 50,
      transition: TransitionPresets.easeInOutCubic,
    });
    const outputStyles = computed(() => ({
      "--checkbox-icon-scale": transitions.value,
    }));
    const handleChange = () => {
      context.emit("change", !props.value);
    };
    const { value } = toRefs(props);
    watch(value, () => {
      if (value.value) {
        source.value = 1;
      } else {
        source.value = 0;
      }
    });
    // Vue3では、context.expose({})で関数を親コンポーネントに公開
    // Vue2では、コンポーネントのインスタンスに直接アクセスして、関数を公開
    if (isVue3) {
      context.expose({ handleChange });
    } else {
      const internalInstance = getCurrentInstance();
      // @ts-ignore
      Object.assign(internalInstance.proxy, { handleChange });
    }
    const insideIconNode = () => {
      if (!props.indeterminate) {
        return h(SimpleIcon, {
          class: [{ simple_checkbox_inner_icon: true }],
          style: outputStyles.value,
          source: CheckMark,
          size: `calc(${props.size} - 4px)`,
          fill: "rgba(255, 255, 255, 1)",
          clickable: true,
          props: {
            source: CheckMark,
            size: `calc(${props.size} - 4px)`,
            fill: "rgba(255, 255, 255, 1)",
            clickable: true,
          },
        });
      } else {
        return h(SimpleIcon, {
          class: [{ simple_checkbox_inner_icon: true }],
          style: outputStyles.value,
          source: HyphenBar,
          size: props.size,
          fill: "rgba(255, 255, 255, 1)",
          props: {
            source: HyphenBar,
            size: props.size,
            fill: "rgba(255, 255, 255, 1)",
          },
        });
      }
    };
    const labelTextNode = (): VNode | undefined => {
      if (props.label !== undefined) {
        return h(
          "span",
          {
            class: [{ simple_checkbox__label_text: true }],
            onClick: handleChange,
            on: {
              click: handleChange,
            },
          },
          props.label
        );
      }
    };
    return () =>
      h("div", { class: [{ simple_checkbox__base: true }] }, [
        h(
          "div",
          {
            class: [
              {
                simple_checkbox__checkbox_container: true,
                simple_checkbox__checked_background: props.value,
              },
            ],
            style: [{ "--checkbox-size": props.size }],
            onClick: handleChange,
            on: {
              click: handleChange,
            },
          },
          [insideIconNode()]
        ),
        labelTextNode(),
      ]);
  },
});
