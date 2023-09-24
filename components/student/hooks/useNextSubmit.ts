import {
  differenceInWeeks,
  getDay,
  isSameDay,
  startOfMonth,
  addDays,
  set,
  getHours,
  getMinutes,
} from "date-fns";
import { Holiday } from "@/types/injectionKeys";
import SimpleDate from "@/utils/SimpleDate";
import { CyclePeriod } from "@/types/assignments";

const dateToToCycle = (date: Date) => ({
  weekIndex: differenceInWeeks(date, startOfMonth(date)),
  dayOfWeekIndex: getDay(date),
});
export const useNextSubmit = (
  holidays: Holiday[],
  cyclePeriod: CyclePeriod[],
  deadlineTime: Date,
  submitOnHoliday: boolean,
) => {
  const isHoliday = (date: Date) => {
    if (submitOnHoliday) {
      return (
        holidays.findIndex((holiday) => isSameDay(date, holiday.date)) !== -1
      );
    }
    return false;
  };
  const isInclude = (date: Date) =>
    cyclePeriod.findIndex(
      (cycle) =>
        cycle.weekIndex === dateToToCycle(date).weekIndex &&
        cycle.dayOfWeekIndex === dateToToCycle(date).dayOfWeekIndex,
    ) !== -1;
  let result = set(SimpleDate.now(), {
    hours: getHours(deadlineTime),
    minutes: getMinutes(deadlineTime),
    seconds: 0,
    milliseconds: 0,
  });
  while (!isInclude(result) || isHoliday(result) || SimpleDate.isPast(result)) {
    result = addDays(result, 1);
  }
  return result;
};
