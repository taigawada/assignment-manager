<script setup lang="ts">
import SimpleDate from "@/utils/SimpleDate";
import { isSameDay, format } from "date-fns";
import { useI18n } from "vue-i18n";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
});
const emits = defineEmits<{
  (e: "click"): void;
}>();

const { t } = useI18n();
const deadlineNotification = computed(() => {
  if (SimpleDate.isPast(props.deadline)) {
    return t("overdue");
  }
  if (isSameDay(props.deadline, SimpleDate.now())) {
    return t("untilToday");
  }
  if (SimpleDate.isTomorrow(props.deadline)) {
    return t("untilTomorrow");
  }
  return "";
});
const deadlineNotificationColor = computed(() => {
  if (SimpleDate.isPast(props.deadline)) {
    return { color: "rgba(196, 0, 0, 1)" };
  }
  if (isSameDay(props.deadline, SimpleDate.now())) {
    return { color: "rgba(60, 130, 214, 1)" };
  }
  if (SimpleDate.isTomorrow(props.deadline)) {
    return { color: "rgba(60, 130, 214, 1)" };
  }
  return "";
});
const formatDateInTranslate = (date: Date) => {
  return format(
    date,
    `MM${t("month")}dd${t("date")}(${t(format(date, "eee"))}${t("day")}) HH${t(
      "hours",
    )}mm${t("minutes")}`,
  );
};
const handleCardClick = () => {
  emits("click");
};
</script>
<template>
  <div class="student-resource-card" @click="handleCardClick">
    <div class="student-resource-card-infomations">
      <div class="student-resource-card-title">{{ title }}</div>
      <div class="student-resource-card-sub-info">
        <span>{{ $t("deadline") }}: </span>
        <span>{{ formatDateInTranslate(deadline) }}</span>
      </div>
    </div>
    <div
      class="student-resource-card-deadline-notification"
      :style="deadlineNotificationColor"
    >
      {{ deadlineNotification }}
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/scss/mixin";
.student-resource-card {
  display: flex;
  align-items: center;
  justify-content: left;
  position: relative;
  margin: var(--space-2) 0;
  padding: var(--space-2) 0;
  width: 100%;
  border-radius: var(--border-radius-1);
  background: var(--surface);
  box-shadow: var(--box-shadow-1);
  cursor: pointer;
}
.student-resource-card:hover {
  background: var(--hovered);
}

.student-resource-card-infomations {
  display: inline-block;
  text-align: left;
  flex: 1;
  margin: 0 0 0 var(--space-4);
}
.student-resource-card-title {
  font-size: var(--font-size-7);
}
.student-resource-card-sub-info {
  font-size: var(--font-size-4);
  display: flex;
  flex-direction: column;
  @include mixin.mq(lg) {
    flex-direction: row;
  }
}
.student-resource-card-deadline-notification {
  font-size: var(--font-size-6);
  color: var(--text-error);
  margin: 0 var(--space-4) 0 0;
}
</style>
