import { isArray, isNumber } from "lodash";
import { CyclePeriod } from "./assignments";

export { type CyclePeriod };

export const validCyclePeriod = (data: unknown): data is CyclePeriod[] => {
  if (!isArray(data)) return false;
  if (
    data.every((cycle) => {
      if ("weekIndex" in cycle && "dayOfWeekIndex" in cycle) {
        if (isNumber(cycle.weekIndex) && isNumber(cycle.dayOfWeekIndex)) {
          return true;
        }
      }
      return false;
    })
  ) {
    return true;
  }
  return false;
};
