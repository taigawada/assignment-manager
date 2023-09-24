import { dayOfWeekStr } from "@materials";
import { format, getHours, getMinutes, isPast, isValid, set } from "date-fns";

import _ from "lodash";
import { NullableAssignment } from "@/types/assignments";
import SimpleDate from "../../../utils/SimpleDate";

export const useAssignmentDetailSettings = (
  initial: NullableAssignment,
  initialSubmittionMethods: string[],
) => {
  const CyclePeriodTransitionRef = ref<HTMLElement | null>(null);
  const initialSettings = ref<NullableAssignment>(initial);
  const initialSubmittionMethod = () => {
    if (typeof initial.submittionMethod === "string") {
      if (initialSubmittionMethods.includes(initial.submittionMethod)) {
        return initial.submittionMethod;
      }
      return "other";
    }
    return "";
  };
  const settings = reactive({
    id: initial.id,
    serial: initial.serial,
    status: initial.status ? initial.status : "draft",
    assignedClasses: initial.assignedClasses ? initial.assignedClasses : [],
    title: initial.title ? initial.title : "",
    description: initial.description ? initial.description : "",
    deadline: isValid(initial.deadline)
      ? initial.deadline
      : SimpleDate.ceilDate(),
    submittionMethod: initialSubmittionMethod(),
    otherSubmittionMethod:
      initialSubmittionMethod() === "other" ? initial.submittionMethod : "",
    isRepeat: initial.isRepeat === undefined ? false : initial.isRepeat,
    submitOnHoliday:
      initial.submitOnHoliday === undefined ? false : initial.submitOnHoliday,
    cyclePeriod: initial.cyclePeriod ? initial.cyclePeriod : [],
  });
  // 変更検知のため、マウント時に初期値としてコピー
  onMounted(() => {
    initialSettings.value = { ...settings };
  });
  const statuses = [
    { label: "下書き", value: "draft" },
    { label: "アクティブ", value: "active" },
  ];
  const classesComboboxField = ref("");
  const classesComboboxOpen = ref(false);
  const isReleseDateSet = ref(false);
  const releaseDateTemp = ref(new Date());
  const releaseDateInput = ref("");
  const releaseDateComputed = computed(() => {
    // if (settings.releaseDate) {
    //   return format(settings.releaseDate, "yyyy年MM月dd日 HH:mm");
    // }
    return "";
  });
  const deadlineDateInput = ref(
    initial.isRepeat
      ? ""
      : initial.deadline === undefined
      ? ""
      : format(initial.deadline, "MM月dd日"),
  );
  const deadlineTimeInput = ref(
    initial.deadline === undefined ? "" : format(initial.deadline, "HH:mm"),
  );
  const deadlineTime = ref<Date | null>(
    initial.deadline ? initial.deadline : null,
  );
  const cyclePeriodPreview = ref(false);
  const cyclePeriodNowSetting = ref<boolean | null>(
    initial.isRepeat ? false : null,
  );
  const isEachWeek = ref(true);
  const cylclePeriodSammarys = computed(() => {
    if (isEachWeek.value) {
      const result = settings.cyclePeriod.map((cycle) => ({
        label: `毎週${dayOfWeekStr(0, cycle.dayOfWeekIndex)}曜日`,
        value: cycle,
      }));
      return result.filter((elm, index, self) => {
        return self.map((el) => el.label).indexOf(elm.label) === index;
      });
    }
    return settings.cyclePeriod.map((cycle) => ({
      label: `第${cycle.weekIndex + 1}${dayOfWeekStr(
        0,
        cycle.dayOfWeekIndex,
      )}曜日`,
      value: cycle,
    }));
  });
  const delayedSubmittionDeadlineTime = reactive({
    meridiem: getHours(SimpleDate.now()) < 12 ? "午前" : "午後",
    hours:
      getHours(SimpleDate.now()) < 12
        ? getHours(SimpleDate.now())
        : getHours(SimpleDate.now()) % 12,
    minutes: getMinutes(SimpleDate.now()),
  });
  const isChanged = computed(
    () =>
      !_.isEqual(
        _.omit(initialSettings.value, ["__ob__"]),
        _.omit(settings, ["__ob__"]),
      ),
  );
  const nowSaving = ref(false);
  const destructionModalOpen = ref(false);
  const validationErrors = ref<string[]>([]);
  const isValidatingStudentPreview = ref(false);
  const isValidatingOnsave = ref(false);
  const studentPreviewErrors = computed(() => {
    const errors = [];
    if (isValidatingStudentPreview.value) {
      if (!settings.title) errors.push("タイトルの入力は必須です。");
      if (!settings.isRepeat) {
        if (!deadlineDateInput.value) {
          errors.push("提出日を設定してください。");
        }
        if (settings.deadline ? isPast(settings.deadline) : false)
          errors.push("締め切りは未来の時間である必要があります。");
      } else if (settings.cyclePeriod === undefined) {
        errors.push("繰り返す曜日を指定してください。");
      } else if (!settings.cyclePeriod!.length)
        errors.push("繰り返す曜日を指定してください。");
      if (!deadlineTime.value) errors.push("締め切り時刻を指定してください。");
    }
    return errors;
  });
  const onSaveErrors = computed(() => {
    const errors = [];
    if (isValidatingOnsave.value) {
      if (!settings.submittionMethod) {
        errors.push("提出方法が設定されていません。");
      } else if (settings.submittionMethod === "other") {
        if (!settings.otherSubmittionMethod)
          errors.push("その他の提出方法を入力してください。");
      }
      if (settings.assignedClasses.length < 1)
        errors.push("最低でも1つのクラスを割り当てる必要があります。");
    }
    return [...studentPreviewErrors.value, ...errors];
  });
  watch(studentPreviewErrors, () => {
    if (isValidatingStudentPreview.value) {
      validationErrors.value = studentPreviewErrors.value;
    } else {
      validationErrors.value = [];
    }
  });
  watch(onSaveErrors, () => {
    if (isValidatingOnsave.value) {
      validationErrors.value = onSaveErrors.value;
    } else {
      validationErrors.value = [];
    }
  });
  return {
    CyclePeriodTransitionRef,
    initialSettings,
    settings,
    statuses,

    classesComboboxField,
    classesComboboxOpen,
    isReleseDateSet,
    releaseDateTemp,
    releaseDateInput,
    releaseDateComputed,

    deadlineDateInput,
    deadlineTimeInput,
    deadlineTime,
    cyclePeriodPreview,
    cyclePeriodNowSetting,
    isEachWeek,
    cylclePeriodSammarys,

    delayedSubmittionDeadlineTime,

    isChanged,
    nowSaving,
    destructionModalOpen,
    isValidatingStudentPreview,
    isValidatingOnsave,
    validationErrors,
    studentPreviewErrors,
    onSaveErrors,
  };
};
