interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}
type BooleanArray = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
][];
type CyclePeriodArray = CyclePeriod[];

function cyclePeriodConverter(
  array: unknown[],
  start: "monday" | "sunday" = "monday",
  isEachWeek: boolean = true,
) {
  const isBooleanArray = Array.isArray(array[0]);
  if (isBooleanArray) {
    const computedDayOfWeek = (dayOfWeekIndex: number) => {
      if (start === "monday") {
        if (dayOfWeekIndex === 6) return 0;
        else return dayOfWeekIndex + 1;
      } else return dayOfWeekIndex;
    };
    const booleanArray = array as BooleanArray;
    const parseResult: CyclePeriodArray = [];
    if (isEachWeek) {
      booleanArray[0].map((dayOfWeek, dayOfWeekIndex) => {
        if (dayOfWeek) {
          [...new Array(5).keys()].map((i) =>
            parseResult.push({
              weekIndex: i,
              dayOfWeekIndex: computedDayOfWeek(dayOfWeekIndex),
            }),
          );
        }
      });
    } else {
      booleanArray.map((week, weekIndex) => {
        week.map((dayOfWeek, dayOfWeekIndex) => {
          if (dayOfWeek) {
            parseResult.push({
              weekIndex: weekIndex,
              dayOfWeekIndex: computedDayOfWeek(dayOfWeekIndex),
            });
          }
        });
      });
    }
    return parseResult;
  } else {
    const dayOfWeekShifter = (dayOfWeekIndex: number) => {
      if (start === "monday") {
        if (dayOfWeekIndex === 0) return 6;
        else return dayOfWeekIndex - 1;
      } else {
        return dayOfWeekIndex;
      }
    };
    const cyclePeriodArray = array as CyclePeriodArray;
    const parseResult: BooleanArray = new Array(4).fill(
      new Array(7).fill(false),
    );
    const deepCopy = [...parseResult];
    cyclePeriodArray.map((cyclePeriod) => {
      if (cyclePeriod.weekIndex <= 3) {
        deepCopy[cyclePeriod.weekIndex] = [...deepCopy[cyclePeriod.weekIndex]];
        deepCopy[cyclePeriod.weekIndex][
          dayOfWeekShifter(cyclePeriod.dayOfWeekIndex)
        ] = true;
      }
    });
    if (isEachWeek) {
      deepCopy.splice(1, parseResult.length - 1);
    }
    return deepCopy;
  }
}

export { cyclePeriodConverter, type CyclePeriod, type BooleanArray };
