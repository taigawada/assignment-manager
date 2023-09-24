import { defineComponent, ref, reactive, PropType, h, VNode } from "vue";
import { SimpleInput } from "../SimpleInput";
import { SimpleCalender } from "../SimpleCalender";
import { TimePicker } from "../TimePicker";
import "./SimpleDateTimePicker.scss";
import { set } from "date-fns";
import { TimeObject } from "../../types/types";

export default defineComponent({
  props: {
    initialDatetime: {
      type: Date,
      default: () => new Date(),
      required: false,
    },
    inputValue: {
      type: String,
      required: true,
    },
    interval: {
      type: Number as PropType<12 | 24>,
      default: 12,
      required: false,
    },
    caption: {
      type: String,
      default: undefined,
      required: false,
    },
    placeholder: {
      type: String,
      default: "日時を選択",
      required: false,
    },
    allowPast: {
      type: Boolean,
      required: false,
    },
    showRelatedDays: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
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
    const currentSelectDate = ref<Date>(props.initialDatetime);
    const currentSelectTime = reactive<TimeObject>({
      meridiem:
        props.interval === 12
          ? props.initialDatetime.getHours() < 12
            ? "午前"
            : "午後"
          : null,
      hours: props.initialDatetime.getHours(),
      minutes: props.initialDatetime.getMinutes(),
    });
    const handleTimeChange = (newValue: TimeObject) => {
      currentSelectTime.meridiem = newValue.meridiem;
      currentSelectTime.hours = newValue.hours;
      currentSelectTime.minutes = newValue.minutes;
      const newValueDeepCopy = { ...newValue };
      if (
        newValueDeepCopy.meridiem !== null &&
        newValueDeepCopy.meridiem !== undefined
      ) {
        newValueDeepCopy.hours =
          newValueDeepCopy.hours +
          (newValueDeepCopy.meridiem === "午後" ? 12 : 0);
      }
      context.emit("change", set(currentSelectDate.value!, newValueDeepCopy));
    };
    const handleSelectDateChange = (date: Date) => {
      currentSelectDate.value = date;
      const currentSelectDeepCopy = { ...currentSelectTime };
      if (currentSelectDeepCopy.meridiem === "午後") {
        currentSelectDeepCopy.hours = currentSelectDeepCopy.hours + 12;
      }
      const setTime = {
        ...currentSelectDeepCopy,
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
      };
      const newDate = set(currentSelectDate.value, setTime);
      context.emit("change", newDate);
    };
    const datetimePickerNode = (): VNode | undefined => {
      if (isEntered.value || isFocus.value) {
        return h(
          "div",
          { class: [{ simple_datetime_picker__float_box: true }] },
          [
            h(SimpleCalender, {
              select: true,
              selected: currentSelectDate.value,
              allowPast: props.allowPast,
              showRelatedDays: props.showRelatedDays,
              props: {
                select: true,
                selected: currentSelectDate.value,
                allowPast: props.allowPast,
                showRelatedDays: props.showRelatedDays,
              },
              onChange: handleSelectDateChange,
              on: {
                change: handleSelectDateChange,
              },
            }),
            h(TimePicker, {
              interval: props.interval,
              time: currentSelectTime,
              props: {
                interval: props.interval,
                time: currentSelectTime,
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
          class: [{ simple_datetime_picker__base: true }],
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
            readonly: true,
            value: props.inputValue,
            disabled: props.disabled,
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
          datetimePickerNode(),
        ]
      );
  },
});
