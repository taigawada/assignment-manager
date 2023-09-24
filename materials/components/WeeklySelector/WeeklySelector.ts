import "./WeeklySelector.scss";
import { defineComponent, computed, PropType, h, VNode } from "vue";
import { dayOfWeekStr } from "../../utilities/utils";
import {
  cyclePeriodConverter,
  CyclePeriod,
  BooleanArray,
} from "./useWeeklySelector";
import { ArrowDown, ArrowUp } from "../../icons.index";
import { SimpleButton } from "../SimpleButton";

type Start = "monday" | "sunday";

export default defineComponent({
  props: {
    weekValue: {
      type: Array as PropType<CyclePeriod[]>,
      default: () => [],
      required: true,
    },
    isEachWeek: {
      type: Boolean,
      required: true,
    },
    start: {
      type: String as PropType<Start>,
      default: "monday",
      required: false,
    },
    sunday: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  setup(props, context) {
    const weekBooleanArray = computed(
      () =>
        cyclePeriodConverter(
          props.weekValue,
          props.start,
          props.isEachWeek,
        ) as BooleanArray,
    );
    const weekArray = computed(() => [
      ...Array(props.isEachWeek ? 1 : 4).keys(),
    ]);
    const weekdaysLength = computed(() => {
      if (props.sunday) {
        return 7;
      } else {
        return 6;
      }
    });
    const weekdaysArray = computed(() => [
      ...Array(weekdaysLength.value).keys(),
    ]);
    const handleClick = (week: number, weekDay: number) => {
      const deepCopy = [...weekBooleanArray.value];
      deepCopy[week] = [...deepCopy[week]];
      deepCopy[week][weekDay] = !deepCopy[week][weekDay];
      context.emit(
        "change",
        cyclePeriodConverter(deepCopy, props.start, props.isEachWeek),
      );
    };
    const changeEachDay = () => {
      context.emit("changeEach:day");
      const changed = cyclePeriodConverter(
        weekBooleanArray.value,
        props.start,
        props.isEachWeek,
      ) as CyclePeriod[];
      context.emit(
        "change",
        changed.filter((el) => el.weekIndex < 4),
      );
    };
    const changeEachWeek = () => {
      context.emit("changeEach:week");
      context.emit("change", []);
    };
    const enabled = (week: number, weekDay: number) => {
      return weekBooleanArray.value[week][weekDay];
    };
    const iconNode = () => {
      return h(
        "div",
        { class: [{ weekly_selector__add_week_container: true }] },
        [
          h(
            SimpleButton,
            {
              class: [{ weekly_selector__add_week: true }],
              plain: true,
              icon: props.isEachWeek ? ArrowDown : ArrowUp,
              props: {
                plain: true,
                icon: props.isEachWeek ? ArrowDown : ArrowUp,
              },
              onClick: props.isEachWeek ? changeEachDay : changeEachWeek,
              on: {
                click: props.isEachWeek ? changeEachDay : changeEachWeek,
              },
            },
            isVue3
              ? () => (props.isEachWeek ? "月ごと" : "週ごと")
              : props.isEachWeek
              ? "月ごと"
              : "週ごと",
          ),
        ],
      );
    };
    const weekdaysNode = (weekIndex: number) =>
      weekdaysArray.value.map((weekdayIndex) => {
        // return h('div', { key: 'weekOfDay' + String(weekIndex) + String(weekdayIndex) }, [
        return h(
          "div",
          {
            key: "weekOfDay" + String(weekIndex) + String(weekdayIndex),
            class: [
              {
                weekly_selector__box: true,
                weekly_selector__box_left_side: weekdayIndex === 0,
                weekly_selector__box_right_side:
                  weekdayIndex === weekdaysLength.value - 1,
                weekly_selector__box_selected: enabled(weekIndex, weekdayIndex),
              },
            ],
            onClick: () => handleClick(weekIndex, weekdayIndex),
            on: {
              click: () => handleClick(weekIndex, weekdayIndex),
            },
          },
          [
            h(
              "span",
              {
                class: [
                  {
                    weekly_selector__box_selected_text: enabled(
                      weekIndex,
                      weekdayIndex,
                    ),
                  },
                ],
              },
              dayOfWeekStr(props.start, weekdayIndex),
            ),
          ],
        );
        // ]);
      });
    const weeksNode = (): VNode[] =>
      weekArray.value.map((weekIndex) => {
        return h("div", { key: weekIndex }, [
          h(
            "div",
            {
              class: [{ weekly_selector__week_caption: true }],
              style: [{ opacity: props.isEachWeek ? 0 : 1 }],
            },
            String(weekIndex + 1) + "週目",
          ),
          h(
            "div",
            { class: [{ weekly_selector__weekdays: true }] },
            weekdaysNode(weekIndex),
          ),
        ]);
      });
    const heightStyle = computed(() => {
      if (props.isEachWeek) {
        return { height: "52px" };
      } else {
        return { height: "208px" };
      }
    });
    return () =>
      h("div", { class: [{ weekly_selector__base: true }] }, [
        h(
          "div",
          {
            class: [
              {
                weekly_selector__weeks_transition: true,
              },
            ],
            style: [heightStyle.value],
          },
          weeksNode(),
        ),
        // iconNode(),
      ]);
  },
});
