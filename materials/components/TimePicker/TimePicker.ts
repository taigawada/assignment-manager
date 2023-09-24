import {
  defineComponent,
  PropType,
  reactive,
  watch,
  toRefs,
  h,
  computed,
} from "vue";
import { SimpleSmoothPicker } from "../SimpleSmoothPicker";
import { TimeObject } from "../../types/types";
import "./TimePicker.scss";

export default defineComponent({
  props: {
    time: {
      type: Object as PropType<TimeObject>,
      required: true,
    },
    interval: {
      type: Number as PropType<12 | 24>,
      default: 12,
      required: false,
    },
    minutesInterval: {
      type: Number,
      default: 1,
      required: false,
    },
  },
  setup(props, context) {
    const hoursArray = computed(() => {
      if (props.interval === 12) {
        if (props.time.meridiem === "午前") {
          return [...Array(13)].map((_: unknown, i) => i);
        }
      }
      return [...Array(props.interval)].map((_: unknown, i) => i);
    });
    const minutesArray = computed(() =>
      [...Array(60 / props.minutesInterval)].map(
        (_: unknown, i) => i * props.minutesInterval
      )
    );
    const currentSelectTime = reactive<TimeObject>({
      meridiem: props.time.meridiem,
      hours: props.time.hours,
      minutes: props.time.minutes,
    });
    const handleMeridiemChange = (newValue: "午前" | "午後") => {
      currentSelectTime.meridiem = newValue;
      context.emit("change", currentSelectTime);
    };
    const handleHoursChange = (newValue: number) => {
      currentSelectTime.hours = newValue;
      context.emit("change", currentSelectTime);
    };
    const handleMinutesChange = (newValue: number) => {
      currentSelectTime.minutes = newValue;
      context.emit("change", currentSelectTime);
    };
    const { time } = toRefs(props);
    watch(time, () => {
      currentSelectTime.meridiem = time.value.meridiem;
      currentSelectTime.hours = time.value.hours;
      currentSelectTime.minutes = time.value.minutes;
    });
    return () =>
      h("div", { class: [{ simple_timepicker__base: true }] }, [
        h(SimpleSmoothPicker, {
          style: [{ display: props.interval === 12 ? "inline-block" : "none" }],
          items: ["午前", "午後"],
          whichSide: "left",
          width: "100px",
          selected: currentSelectTime.meridiem
            ? currentSelectTime.meridiem
            : undefined,
          props: {
            items: ["午前", "午後"],
            whichSide: "left",
            width: "100px",
            selected: currentSelectTime.meridiem
              ? currentSelectTime.meridiem
              : undefined,
          },
          onChange: handleMeridiemChange,
          on: {
            change: handleMeridiemChange,
          },
        }),
        h(SimpleSmoothPicker, {
          items: hoursArray.value,
          whichSide: props.interval === 24 ? "left" : "center",
          width: "100px",
          suffix: "時",
          selected:
            props.interval === 24
              ? currentSelectTime.hours
              : currentSelectTime.hours % 12,
          props: {
            items: hoursArray.value,
            whichSide: props.interval === 24 ? "left" : "center",
            width: "100px",
            suffix: "時",
            selected:
              props.interval === 24
                ? currentSelectTime.hours
                : currentSelectTime.hours % 12,
          },
          onChange: handleHoursChange,
          on: {
            change: handleHoursChange,
          },
        }),
        h(SimpleSmoothPicker, {
          items: minutesArray.value,
          whichSide: "right",
          width: "100px",
          suffix: "分",
          selected: currentSelectTime.minutes,
          props: {
            items: minutesArray.value,
            whichSide: "right",
            width: "100px",
            suffix: "分",
            selected: currentSelectTime.minutes,
          },
          onChange: handleMinutesChange,
          on: {
            change: handleMinutesChange,
          },
        }),
      ]);
  },
});
