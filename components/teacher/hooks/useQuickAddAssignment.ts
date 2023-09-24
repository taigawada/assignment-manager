import { isPast, isValid } from "date-fns";

export const useQuickAddAssignment = () => {
  const title = ref("");
  const deadlineInputValue = ref("");
  const deadline = ref<Date>(SimpleDate.ceilDate());
  const submitMethod = ref("");
  const cantAdd = computed(() => {
    if (title.value.length === 0) return true;
    if (!isValid(deadline.value) || isPast(deadline.value!)) return true;
    if (submitMethod.value === "") return true;
    return false;
  });
  return {
    title,
    deadline,
    deadlineInputValue,
    submitMethod,
    cantAdd,
  };
};
