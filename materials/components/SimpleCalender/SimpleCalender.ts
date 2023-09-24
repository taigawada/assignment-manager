import {
  computed,
  defineComponent,
  ref,
  PropType,
  reactive,
  h,
  VNode,
} from "vue";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  getDate,
  getDay,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isFuture,
  differenceInWeeks,
} from "date-fns";
import { ArrowLeft, ArrowRight } from "../../icons.index";
import { SimpleIcon } from "../SimpleIcon";
import { CyclePeriod } from "../WeeklySelector/useWeeklySelector";
import { dayOfWeekStr } from "../../utilities/utils";
import "./SimpleCalender.scss";
import { SimpleSpinner } from "../SimpleSpinner";

interface Entered {
  weekIndex: null | number;
  weekDayIndex: null | number;
}

type Holiday = { date: Date; name: string };

export default defineComponent({
  props: {
    start: {
      type: String as PropType<"monday" | "sunday">,
      default: "monday",
      required: false,
    },
    select: {
      type: Boolean,
      default: false,
      required: false,
    },
    selected: {
      type: Date,
      default: undefined,
      required: false,
    },
    allowPast: {
      type: Boolean,
      default: true,
      required: false,
    },
    showRelatedDays: {
      type: Boolean,
      default: true,
      required: false,
    },
    highLights: {
      type: Array as PropType<CyclePeriod[]>,
      default: () => [],
      required: false,
    },
    holidays: {
      type: Array as PropType<Holiday[] | null>,
      default: undefined,
      required: false,
    },
    hiddenHighLightInHolidays: {
      type: Boolean,
      required: false,
    },
  },
  setup(props, context) {
    const isLoading = computed(() =>
      props.holidays !== undefined
        ? props.holidays === null
          ? true
          : false
        : false,
    );
    const nowEntered = reactive<Entered>({
      weekIndex: null,
      weekDayIndex: null,
    });
    const mouseEnter = (weekIndex: number, weekDayIndex: number) => {
      nowEntered.weekIndex = weekIndex;
      nowEntered.weekDayIndex = weekDayIndex;
    };
    const mouseLeave = () => {
      nowEntered.weekIndex = null;
      nowEntered.weekDayIndex = null;
    };
    const isEntered = (weekIndex: number, weekDayIndex: number) => {
      return (
        nowEntered.weekIndex === weekIndex &&
        nowEntered.weekDayIndex === weekDayIndex
      );
    };
    const weekStartsOn = computed(() => (props.start === "monday" ? 1 : 0));
    const currentShowDate = ref<Date>(
      props.selected ? props.selected : new Date(),
    );
    const currentSelectedDate = ref<Date | undefined>(props.selected);
    const showHighLights = (date: Date, isHoliday: boolean | string) => {
      if (props.highLights.length > 0 && !currentSelectedDate.value) {
        const highLights =
          props.highLights.findIndex(
            (elememt) =>
              elememt.weekIndex ===
                differenceInWeeks(date, startOfMonth(date)) &&
              elememt.dayOfWeekIndex === getDay(date) &&
              isSameMonth(date, currentShowDate.value),
          ) !== -1;
        if (highLights) {
          // 祝日かどうかを判定
          return props.hiddenHighLightInHolidays
            ? typeof isHoliday === "string"
              ? false
              : true
            : true;
        } else {
          return false;
        }
      } else {
        if (props.select) {
          return currentSelectedDate.value
            ? isSameDay(date, currentSelectedDate.value)
            : false;
        }
      }
    };
    const handleDateSelect = (date: Date, weekDayIndex: number) => {
      if (props.allowPast || isFuture(date) || isSameDay(new Date(), date)) {
        if (props.select && isSameMonth(date, currentShowDate.value)) {
          if (weekDayIndex === 6) weekDayIndex = -weekStartsOn.value;
          currentSelectedDate.value = date;
          context.emit("change", date);
        }
      }
    };
    const showDateString = (): string =>
      format(currentShowDate.value, "yyyy年MM月");
    const handleAddMonth = () => {
      currentShowDate.value = addMonths(currentShowDate.value, 1);
    };
    const handleSubMonth = () => {
      currentShowDate.value = subMonths(currentShowDate.value, 1);
    };
    const showHolidays = (date: Date) => {
      let sameMonth = true;
      if (!props.showRelatedDays)
        sameMonth = isSameMonth(date, currentShowDate.value);
      if (
        props.holidays !== undefined &&
        props.holidays !== null &&
        sameMonth
      ) {
        const find = props.holidays.find((holiday) =>
          isSameDay(date, holiday.date),
        );
        if (find !== undefined) {
          return typeof find.name === "string" ? find.name : false;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    const showDate = (date: Date) => {
      if (props.showRelatedDays) {
        return getDate(date);
      } else {
        return isSameMonth(date, currentShowDate.value) ? getDate(date) : "";
      }
    };
    const isPastDay = (day: Date) => {
      return props.allowPast
        ? true
        : isFuture(day) || isSameDay(new Date(), day);
    };
    const dayWeekArray = [...Array(7).keys()];
    const getCalendarArray = computed(() => {
      const weekStartDate = eachWeekOfInterval(
        {
          start: startOfMonth(currentShowDate.value),
          end: endOfMonth(currentShowDate.value),
        },
        {
          weekStartsOn: weekStartsOn.value,
        },
      );
      return weekStartDate.map((startDate: Date) =>
        eachDayOfInterval({
          start: startDate,
          end: endOfWeek(startDate, {
            weekStartsOn: weekStartsOn.value,
          }),
        }),
      );
    });
    const pointer = computed(() => {
      if (props.select) {
        return { "--cursor-calender-data": "pointer" };
      } else {
        return { "--cursor-calender-data": "default" };
      }
    });
    const loadingSpinnerNode = () =>
      h("div", { class: [{ simple_calender__loading_spinner_base: true }] }, [
        h(SimpleSpinner, {
          size: "large",
          color: [60, 130, 214],
          props: { size: "large", color: [60, 130, 214] },
        }),
      ]);
    const headerNode = () =>
      h("div", { class: [{ simple_calender__heading: true }] }, [
        h(SimpleIcon, {
          source: ArrowLeft,
          size: "16px",
          fill: "var(--text)",
          clickable: true,
          props: {
            source: ArrowLeft,
            size: "16px",
            fill: "var(--text)",
            clickable: true,
          },
          onClick: handleSubMonth,
          on: {
            click: handleSubMonth,
          },
        }),
        h("span", showDateString()),
        h(SimpleIcon, {
          source: ArrowRight,
          size: "16px",
          fill: "var(--text)",
          clickable: true,
          props: {
            source: ArrowRight,
            size: "16px",
            fill: "var(--text)",
            clickable: true,
          },
          onClick: handleAddMonth,
          on: {
            click: handleAddMonth,
          },
        }),
      ]);
    const tableHeaderNode = () =>
      dayWeekArray.map((dayweekIndex) => {
        return h(
          "th",
          {
            key: dayOfWeekStr(props.start, dayweekIndex),
            class: [{ simple_calender__weekofday_header: true }],
          },
          dayOfWeekStr(props.start, dayweekIndex),
        );
      });
    const tableDataNode = (): VNode[] =>
      getCalendarArray.value.map((week, weekIndex) => {
        return h(
          "tr",
          week.map((date, dateIndex) => {
            const holiday = showHolidays(date);
            return h(
              "td",
              {
                key: String(date),
                title: holiday ? holiday : "",
                domProps: {
                  title: holiday ? holiday : "",
                },
                class: [
                  {
                    simple_calender__date_data: true,
                    calenderShowDisable:
                      !isSameMonth(date, currentShowDate.value) ||
                      !isPastDay(date),
                    calenderDataEntered:
                      props.select &&
                      isEntered(weekIndex, dateIndex) &&
                      isSameMonth(date, currentShowDate.value) &&
                      isPastDay(date),
                    calenderDataSelected: showHighLights(date, holiday),
                  },
                ],
                style: [pointer.value],
                onMouseenter: () => mouseEnter(weekIndex, dateIndex),
                onMouseleave: mouseLeave,
                onClick: () => handleDateSelect(date, dateIndex),
                on: {
                  mouseenter: () => mouseEnter(weekIndex, dateIndex),
                  mouseleave: mouseLeave,
                  click: () => handleDateSelect(date, dateIndex),
                },
              },
              [
                showDate(date),
                /* eslint-disable */
                holiday
                  ? h("div", {
                      class: [
                        {
                          simple_calender__holidays_icon: true,
                          simple_calender__holidays_icon_alpha: !isSameMonth(
                            date,
                            currentShowDate.value,
                          ),
                        },
                      ],
                    })
                  : undefined,
                /* eslint-enable */
              ],
            );
          }),
        );
      });
    const calenderTableNode = () =>
      h("table", { class: [{ simple_calender__table: true }] }, [
        h("tr", tableHeaderNode()),
        tableDataNode(),
      ]);
    return () =>
      h(
        "div",
        {
          class: [
            {
              simple_calender___container: true,
              simple_calender___container_loading: isLoading.value,
            },
          ],
        },
        [
          headerNode(),
          calenderTableNode(),
          isLoading.value ? loadingSpinnerNode() : undefined,
        ],
      );
  },
});
