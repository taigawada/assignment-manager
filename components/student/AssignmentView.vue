<script setup lang="ts">
import { useI18n } from "vue-i18n";
import SimpleDate from "@/utils/SimpleDate";
import { SimpleButton, SimpleSkeleton } from "@materials";
import { ArrowLeft } from "@materials/icons";
import { format, parseISO } from "date-fns";
import SubmitButton from "./SubmitButton.vue";
import { PropType } from "nuxt/dist/app/compat/capi";

export interface StudentViewAssignment {
  title: string;
  description: string;
  deadline: Date | null;
}

const props = defineProps({
  previous: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
  },
  assignment: {
    type: Object as PropType<StudentViewAssignment>,
    default: null,
  },
  submittedAt: {
    type: Date,
    default: null,
  },
});
const { t } = useI18n();
const formatDayInTranslate = (date: Date) => {
  return format(
    date,
    `MM${t("month")}dd${t("date")}(${t(format(date, "eee"))}${t("day")})`,
  );
};
const formatTimeInTranslate = (date: Date) => {
  return format(date, `HH${t("hours")}mm${t("minutes")}`);
};
const deadlineDate = computed(() => {
  if (props.assignment?.deadline) {
    if (SimpleDate.isToday(props.assignment.deadline)) return t("today");
    if (SimpleDate.isTomorrow(props.assignment.deadline)) return t("tommorow");
    return formatDayInTranslate(props.assignment.deadline);
  }
  return "";
});
const deadlineTime = computed(() => {
  if (props.assignment?.deadline) {
    return formatTimeInTranslate(props.assignment.deadline);
  }
  return "";
});
const handlePrevious = () => {
  navigateTo(props.previous);
};
const handleOnSubmit = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return SimpleDate.now().toISOString();
};
const handleOnSubmitCancel = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return SimpleDate.now().toISOString();
};
const isSubmitted = ref(false);
const submittedDate = ref("");
const handleSubmitSuccess = (time: string) => {
  isSubmitted.value = !isSubmitted.value;
  const submittedAt = parseISO(time);
  submittedDate.value = format(
    submittedAt,
    `MM${t("month")}dd${t("date")}(${t(format(submittedAt, "eee"))}${t(
      "day",
    )})HH${t("hours")}mm${t("minutes")}${t("submittedIn")}`,
  );
};
const handleSubmitFailed = (error: string) => {
  isSubmitted.value = false;
  console.error(error);
};
</script>
<template>
  <div class="assignment-detail-container">
    <div class="assignment-detail-header">
      <SimpleButton
        v-show="!$isMobile.value"
        normal
        :icon="ArrowLeft"
        iconSide="left"
        @click="handlePrevious"
      >
        {{ $t("back") }}
      </SimpleButton>
      <div class="assignment-detail-submit-button">
        <SubmitButton
          :disabled="loading"
          :isSubmitted="isSubmitted"
          :onSubmit="handleOnSubmit"
          :onSubmitCancel="handleOnSubmitCancel"
          @success="handleSubmitSuccess"
          @failed="handleSubmitFailed"
        />
        <span class="assignment-detail-submit-date">
          {{ isSubmitted ? submittedDate : "" }}
        </span>
      </div>
    </div>
    <div class="assignment-detail-title-container">
      <div class="assignment-detail-title">
        <component
          :is="loading ? 'SimpleSkeleton' : 'span'"
          display="inline"
          :size="{
            width: '400px',
            height: '40px',
          }"
        >
          {{ assignment?.title }}
        </component>
      </div>
    </div>
    <div class="assignment-detail-deadline-container">
      <div class="assignment-detail-deadline">
        <div style="white-space: nowrap; margin-right: var(--space-4)">
          {{ $t("deadline") }}:
        </div>
        <component
          :is="loading ? 'SimpleSkeleton' : 'div'"
          display="inline"
          :size="{
            width: '600px',
            height: '15px',
          }"
        >
          {{ deadlineDate }} {{ deadlineTime }}
        </component>
      </div>
    </div>
    <div class="assignment-detail-content">
      <div
        style="
          box-sizing: border-box;
          height: 1px;
          border: 0.5px solid var(--text);
          margin: 10px 0;
        "
      ></div>
      <div
        v-if="!loading"
        class="assignment-detail-description"
        v-html="assignment?.description"
      ></div>
      <div v-else>
        <SimpleSkeleton type="text" :lines="4" />
        <SimpleSkeleton type="text" :lines="4" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/scss/mixin";
.assignment-detail-container {
  margin: var(--space-6);
}
.assignment-detail-header {
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 71px;
  @include mixin.mq(lg) {
    justify-content: space-between;
  }
}
.assignment-detail-submit-button {
  text-align: end;
  display: block;
}
.assignment-detail-title-container {
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
}
.assignment-detail-deadline-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 80%;
  margin: 0 auto;
  text-align: left;
}
.assignment-detail-deadline {
  display: inline-flex;
  align-items: center;
}
.assignment-detail-icon {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin-right: var(--space-4);
}
.assignment-detail-title {
  font-size: var(--font-size-10);
  text-align: left;
}
.assignment-detail-submit-date {
  color: rgba(53, 146, 185, 1);
  font-size: var(--font-size-4);
}
.assignment-detail-content {
  width: 80%;
  margin: 0 auto;
  text-align: left;
}
.assignment-detail-description {
  :deep(h1) {
    font-size: var(--font-size-8);
    font-weight: 530;
  }
  :deep(h3) {
    margin: var(--space-2) 0;
    font-size: var(--font-size-7);
    font-weight: 500;
  }
  :deep(p) {
    margin: var(--space-2) 0;
    font-size: var(--font-size-5);
  }
}
</style>
