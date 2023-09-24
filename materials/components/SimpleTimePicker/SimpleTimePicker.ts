import { defineComponent, reactive, ref, onMounted, PropType, h } from "vue";
import { SimpleInput } from "../SimpleInput";
import { TimePicker } from "../TimePicker";
import { set } from "date-fns";
import { TimeObject } from "../../types/types";
import "./SimpleTimePicker.scss";
export default defineComponent({
  props: {
    initialTime: {
      type: Date,
      default: undefined,
      required: false,
    },
    inputValue: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: undefined,
      required: false,
    },
    placeholder: {
      type: String,
      default: "時間を選択",
      required: false,
    },
    interval: {
      type: Number as PropType<12 | 24>,
      default: 24,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    error: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  setup(props, context) {
    const isFocus = ref(false);
    const isEntered = ref(false);
    const mouseleave = () => {
      isEntered.value = false;
    };
    const mousedown = () => {
      if (!props.disabled) {
        isEntered.value = true;
      }
    };
    const inFocus = () => {
      isFocus.value = true;
    };
    const outFocus = () => {
      isFocus.value = false;
    };
    onMounted(() => {
      if (props.initialTime !== undefined) {
        context.emit("change", props.initialTime);
      }
    });
    const selectedDate = reactive<TimeObject>({
      meridiem:
        props.interval === 12
          ? (props.initialTime
              ? props.initialTime.getHours()
              : new Date().getHours()) < 12
            ? "午前"
            : "午後"
          : null,
      hours: props.initialTime
        ? props.initialTime.getHours()
        : new Date().getHours(),
      minutes: props.initialTime
        ? props.initialTime.getMinutes()
        : new Date().getMinutes(),
    });
    const handleTimeChange = (newValue: TimeObject) => {
      selectedDate.meridiem = newValue.meridiem;
      selectedDate.hours = newValue.hours;
      selectedDate.minutes = newValue.minutes;
      const baseDate = new Date(2019, 4, 26, 0);
      if (newValue.meridiem !== null && newValue.meridiem !== undefined) {
        newValue.hours = newValue.hours + newValue.meridiem === "午後" ? 12 : 0;
      }
      context.emit("change", set(baseDate, newValue));
    };
    const timePickerNode = () => {
      if (isEntered.value || isFocus.value) {
        return h(
          "div",
          {
            class: [{ simple_time_picker__float_box: true }],
          },
          [
            h(TimePicker, {
              interval: props.interval,
              time: selectedDate,
              props: {
                interval: props.interval,
                time: selectedDate,
              },
              onChange: handleTimeChange,
              on: {
                change: handleTimeChange,
              },
            }),
          ]
        );
      }
    };
    return () =>
      h(
        "div",
        {
          onMousedown: mousedown,
          onMouseleave: mouseleave,
          on: {
            mousedown: mousedown,
            mouseleave: mouseleave,
          },
        },
        [
          h(SimpleInput, {
            caption: props.caption,
            placeholder: props.placeholder,
            disabled: props.disabled,
            readonly: true,
            value: props.inputValue,
            error: props.error,
            props: {
              caption: props.caption,
              placeholder: props.placeholder,
              readonly: true,
              value: props.inputValue,
              disabled: props.disabled,
              error: props.error,
            },
            onFocusin: inFocus,
            onfocusout: outFocus,
            on: {
              focusin: inFocus,
              focusout: outFocus,
            },
          }),
          timePickerNode(),
        ]
      );
  },
});
