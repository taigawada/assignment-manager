import { isPast } from "date-fns";

export const statusTranslate = (str: string, deadline: Date) => {
  if (str === "draft")
    return {
      label: "下書き",
      processing: true,
      warn: false,
      success: false,
    };
  if (isPast(deadline))
    return {
      label: "締切済み",
      processing: false,
      warn: true,
      success: false,
    };
  if (str === "active")
    return {
      label: "アクティブ",
      processing: true,
      warn: false,
      success: false,
    };
};
