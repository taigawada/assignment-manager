import "./SimpleToast.scss";

import {
  defineComponent,
  ref,
  toRefs,
  watch,
  inject,
  h,
  onMounted,
  computed,
  PropType,
} from "vue";
import { nextFrame } from "../../components/compositions/useAccordionAnimation";
import { SimpleIcon } from "../SimpleIcon";
import { CloseCross } from "../../icons.index";

import { ToastTimerKey, ToastTimerStore } from "./useToastStore";

interface toastAction {
  label: string;
  onAction: () => void;
}

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    duration: {
      type: Number,
      default: 3000,
      required: false,
    },
    content: {
      type: String,
      default: "SimpleToast",
      required: true,
    },
    action: {
      type: Object as PropType<toastAction>,
      default: undefined,
      required: false,
    },
    error: {
      type: Boolean,
      default: false,
      required: false,
    },
    clickToHide: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  setup(props, context) {
    let toastTimerStore: ToastTimerStore | null = null;
    if (!isVue3) {
      // @ts-ignore
      toastTimerStore = context.root.$toastStore;
    } else {
      toastTimerStore = inject(ToastTimerKey)!;
    }
    if (!toastTimerStore) {
      throw new Error("Toast state store is not provided.");
    }
    const currentDismissTimer = ref<NodeJS.Timeout | null>(null);
    const toastRef = ref<HTMLElement | null>(null);
    onMounted(() => {
      if (!isVue3) {
        // @ts-ignore
        toastRef.value = context.refs.toastRef;
      }
    });
    const { active } = toRefs(props);

    const dismissAnimation = async () => {
      toastTimerStore!.resetTimerKey(currentDismissTimer.value);
      currentDismissTimer.value = null;
      context.emit("dismiss");
      if (toastRef.value) {
        toastRef.value.style.bottom = "-5vh";
        await new Promise((resolve) => setTimeout(resolve, 200));
        toastRef.value.style.display = "none";
      }
    };
    const handleDismiss = () => {
      if (currentDismissTimer.value) {
        clearTimeout(currentDismissTimer.value);
      }
      dismissAnimation();
      context.emit("dismiss");
    };
    watch(active, () => {
      if (active.value) {
        if (toastRef.value) {
          toastRef.value.style.display = "inline-flex";
          nextFrame(() => {
            if (toastTimerStore) {
              const timer = setTimeout(() => {
                dismissAnimation();
              }, props.duration);
              toastTimerStore!.setTimerKey(timer);
              currentDismissTimer.value = timer;
            }
          });
        }
      } else {
        handleDismiss();
      }
    });
    const timerKeyPosition = computed(() => {
      if (currentDismissTimer.value && toastTimerStore) {
        return toastTimerStore.timerKeyArray.indexOf(currentDismissTimer.value);
      } else return -1;
    });
    watch(timerKeyPosition, () => {
      if (toastRef.value && timerKeyPosition.value >= 0) {
        toastRef.value.style.bottom = `calc(${
          timerKeyPosition.value + 1
        } * 9vh)`;
      }
    });
    return () =>
      h(
        "div",
        {
          ref: isVue3 ? toastRef : "toastRef",
          class: [
            { simple_toast__base: true, simple_toast__base_error: props.error },
          ],
        },
        [
          h(
            "span",
            { class: [{ simple_toast__content_text: true }] },
            props.content
          ),
          /* eslint-disable */
          props.action
            ? h(
                "span",
                {
                  class: [{ simple_toast__action_label: true }],
                  onClick: () => {
                    props.action?.onAction();
                    if (props.clickToHide) handleDismiss();
                  },
                  on: {
                    click: () => {
                      props.action?.onAction();
                      if (props.clickToHide) handleDismiss();
                    },
                  },
                },
                props.action.label
              )
            : undefined,
          /* eslint-enable */
          h(SimpleIcon, {
            source: CloseCross,
            size: "16px",
            fill: "var(--text-white)",
            clickable: true,
            props: {
              source: CloseCross,
              size: "16px",
              fill: "var(--text-white)",
              clickable: true,
            },
            onClick: handleDismiss,
            on: {
              click: handleDismiss,
            },
          }),
        ]
      );
  },
});
