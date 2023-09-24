import { defineComponent, ref, h, onMounted, VNode } from "vue";
import { SimpleInput } from "../SimpleInput";
import { SimpleCalender } from "../SimpleCalender";
import "./SimpleDatePicker.scss";

export default defineComponent({
  props: {
    initialDate: {
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
      default: "日付を選択",
      required: false,
    },
    allowPast: {
      type: Boolean,
      required: false,
    },
    showRelatedDays: {
      type: Boolean,
      default: false,
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
    onMounted(() => {
      if (props.initialDate !== undefined)
        handleSelectDateChange(props.initialDate);
    });
    const currentSelectDate = ref<Date>(
      props.initialDate !== undefined ? props.initialDate : new Date()
    );
    const handleSelectDateChange = (date: Date) => {
      currentSelectDate.value = date;
      context.emit("change", date);
    };
    const datePickerNode = (): VNode | undefined => {
      if (isEntered.value || isFocus.value) {
        return h(SimpleCalender, {
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
        });
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
          datePickerNode(),
        ]
      );
  },
});
