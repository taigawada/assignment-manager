<script setup lang="ts">
// import AssignmentDetailSettingsSkelton from "./AssignmentDetailSettingsSkelton.vue";
import {
  SimpleButton,
  SimpleCard,
  SimpleInput,
  SimpleCheckbox,
  SimpleTimePicker,
  SimpleDatePicker,
  SimpleSelector,
  SimpleCombobox,
  SimpleStack,
  WeeklySelector,
  SimpleCalender,
  SimpleIcon,
  SimpleTag,
} from "@materials";
import TipTapEditor from "@/components/TipTap/TipTapEditor.vue";
import { ArrowLeft, ExclamationMark } from "@materials/icons";
import {
  format,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  set,
} from "date-fns";
import { PropType } from "nuxt/dist/app/compat/capi";
import type { NullableAssignment, CyclePeriod } from "@/types/assignments";
import { holidayKey } from "@/types/injectionKeys";
import { useNextSubmit } from "@/components/student/hooks/useNextSubmit";
import { validCyclePeriod } from "@/types/typeGuard";
import { useAccordionAnimation } from "./hooks/useAccordionAnimation/useAccordionAnimation";
import { useAssignmentDetailSettings } from "./hooks/useAssignmentDetailSettings";

const props = defineProps({
  initialValue: {
    type: Object as PropType<NullableAssignment>,
    required: true,
  },
  classes: {
    type: Array as PropType<
      { id: number; year: number; name: string; schoolId: number }[]
    >,
    required: true,
  },
  submittionMethods: {
    type: Array as PropType<string[]>,
    required: true,
  },
  onSave: {
    type: Function as PropType<(settings: NullableAssignment) => Promise<void>>,
    required: true,
  },
});
const holidays = inject(holidayKey, []);
const {
  settings,
  statuses,

  classesComboboxField,
  classesComboboxOpen,

  deadlineDateInput,
  deadlineTimeInput,
  deadlineTime,
  cyclePeriodNowSetting,
  cylclePeriodSammarys,

  isChanged,

  isValidatingStudentPreview,
  isValidatingOnsave,
  studentPreviewErrors,
  onSaveErrors,
  validationErrors,
  // eslint-disable-next-line vue/no-setup-props-destructure
} = useAssignmentDetailSettings({ ...props.initialValue }, [
  ...props.submittionMethods,
]);
const handlePreviousPage = () => {
  navigateTo("/teachers");
};
const handleStudentPagePreview = () => {
  isValidatingStudentPreview.value = true;
  if (studentPreviewErrors.value.length === 0) {
    let deadline = settings.deadline?.toISOString();
    if (settings.deadline && settings.isRepeat) {
      deadline = useNextSubmit(
        holidays,
        settings.cyclePeriod,
        settings.deadline,
        settings.submitOnHoliday,
      ).toISOString();
    }
    navigateTo(
      {
        path: "/teachers/preview",
        query: {
          previous: `${settings.serial}/edit` || "new",
          title: settings.title,
          description: settings.description,
          deadline,
        },
      },
      { open: { target: "_blank" } },
    );
    isValidatingStudentPreview.value = false;
  }
};
const submitting = ref(false);
const handleOnSave = async () => {
  submitting.value = true;
  isValidatingStudentPreview.value = true;
  isValidatingOnsave.value = true;
  if (onSaveErrors.value.length === 0) {
    await props.onSave(settings);
    isValidatingStudentPreview.value = false;
    isValidatingOnsave.value = false;
  }
  submitting.value = false;
};
const handleTitleChange = (newValue: string) => {
  settings.title = newValue;
};
const handleDescriptionChange = (newValue: string) => {
  settings.description = newValue;
};

// cycle period settings
const handleIsRepeatChange = (newBoolean: boolean) => {
  if (newBoolean) cyclePeriodNowSetting.value = newBoolean;
  else cyclePeriodNowSetting.value = null;
  settings.isRepeat = newBoolean;
};
const handleSubmitOnHolidayChange = (newBoolean: boolean) => {
  settings.submitOnHoliday = newBoolean;
};
const handleCyclePeriodChange = (newValue: CyclePeriod[]) => {
  settings.cyclePeriod = newValue;
};
const handleCyclePeriodSettingDone = () => {
  cyclePeriodNowSetting.value = false;
};
const handleCyclePeriodDelete = (cyclePeriod: CyclePeriod) => {
  settings.cyclePeriod = settings.cyclePeriod.filter(
    (cycle) => cycle.dayOfWeekIndex !== cyclePeriod.dayOfWeekIndex,
  );
};
const handleCyclePeriodEdit = () => {
  cyclePeriodNowSetting.value = true;
};

// general settings
const handleStatusChange = (newValue: "draft" | "active") => {
  settings.status = newValue;
};
const handleClassesComboboxFieldChange = (newValue: string) => {
  classesComboboxField.value = newValue;
};
const handleClassesComboboxFieldRemove = () => {
  classesComboboxField.value = "";
};
const handleClassesComboboxSelectChange = (newSelected: string[]) => {
  settings.assignedClasses = newSelected.map((selected) => ({
    id: props.classes.find((target) => target.name === selected)!.id,
    name: selected,
  }));
};
const handleClassesDelete = (classname: string) => {
  settings.assignedClasses = settings.assignedClasses.filter((el) => {
    return el.name !== classname;
  });
};
const hnaldeClassesComboboxFloatOpen = () => {
  classesComboboxOpen.value = true;
};
const hnaldeClassesComboboxFloatClose = () => {
  classesComboboxOpen.value = false;
};
const handleDeadlineDateChange = (newDate: Date) => {
  deadlineDateInput.value = format(newDate, "MM月dd日");
  settings.deadline = set(
    settings.deadline
      ? settings.deadline
      : set(new Date(), { seconds: 0, milliseconds: 0 }),
    {
      year: getYear(newDate),
      month: getMonth(newDate),
      date: getDate(newDate),
    },
  );
};
const handleDeadlineTimeChange = (newTime: Date) => {
  deadlineTimeInput.value = format(newTime, "HH:mm");
  deadlineTime.value = newTime;
  settings.deadline = set(
    settings.deadline
      ? settings.deadline
      : set(new Date(), { seconds: 0, milliseconds: 0 }),
    {
      hours: getHours(newTime),
      minutes: getMinutes(newTime),
    },
  );
};
const handleSubmitMethodChange = (newValue: string) => {
  settings.submittionMethod = newValue;
};
const handleOtherSubmitMethodChange = (newValue: string) => {
  settings.otherSubmittionMethod = newValue;
};
const {
  accordionEnter,
  accordionLeave,
  accordionAfterEnter,
  accordionAfterLeave,
} = useAccordionAnimation();
</script>
<template>
  <div class="settings-page-container">
    <SimpleStack
      class="button-group"
      distribution="spaceBetween"
      alignment="center"
    >
      <SimpleButton
        normal
        :icon="ArrowLeft"
        iconSide="left"
        @click="handlePreviousPage"
      >
        戻る
      </SimpleButton>
      <SimpleStack distribution="right" alignment="center">
        <SimpleButton normal @click="handleStudentPagePreview">
          プレビュー
        </SimpleButton>
        <SimpleButton
          primary
          :disabled="!isChanged"
          :loading="submitting"
          @click="handleOnSave"
        >
          {{ $route.path === "/teachers/assignments/new" ? "追加" : "保存" }}
        </SimpleButton>
      </SimpleStack>
    </SimpleStack>
    <div class="detail-settings-container">
      <div class="detail-settings">
        <div v-show="validationErrors.length > 0" class="valudation-banner">
          <SimpleStack class="validation-error-header" distribution="left">
            <SimpleIcon
              :source="ExclamationMark"
              fill="rgba(255, 121, 121, 1)"
            />
            <span class="validation-error-text">
              この提出物には{{ validationErrors.length }}個のエラーがあります。
            </span>
          </SimpleStack>
          <ul class="validation-error-list">
            <li v-for="error in validationErrors" :key="error">
              <span> {{ error }} </span>
            </li>
          </ul>
        </div>
        <SimpleInput
          caption="提出物タイトル"
          :value="settings.title ? settings.title : ''"
          :maxlength="settings.title.length < 40 ? undefined : 50"
          :error="
            validationErrors.find(
              (error) => error === 'タイトルの入力は必須です。',
            )
          "
          @change="handleTitleChange"
        />
        <TipTapEditor
          caption="説明"
          placeholder="説明を入力..."
          :initialValue="settings.description"
          :value="settings.description"
          @change:editor="handleDescriptionChange"
        />
        <SimpleCheckbox
          label="繰り返し提出"
          :value="settings.isRepeat"
          @change="handleIsRepeatChange"
        />
        <Transition
          class="cycle-period-container"
          name="accordion"
          @enter="accordionEnter"
          @after-enter="accordionAfterEnter"
          @leave="accordionLeave"
          @after-leave="accordionAfterLeave"
        >
          <div
            v-if="cyclePeriodNowSetting"
            key="edit"
            class="cycle-period-accordion"
          >
            <div class="submit-on-holiday-checkbox-container">
              <SimpleCheckbox
                label="祝日は提出しない"
                :value="settings.submitOnHoliday"
                @change="handleSubmitOnHolidayChange"
              />
            </div>
            <div style="text-align: center">
              <WeeklySelector
                :isEachWeek="true"
                :weekValue="settings.cyclePeriod"
                @change="handleCyclePeriodChange"
              />
            </div>
            <div class="detail-settings-preview-calender">
              <!-- :holidays="stringToDate(store.getters.holidays)" -->
              <SimpleCalender
                :holidays="holidays"
                :highLights="settings.cyclePeriod"
                :hiddenHighLightInHolidays="settings.submitOnHoliday"
              />
            </div>
            <SimpleButton
              normal
              :disabled="
                settings.cyclePeriod ? settings.cyclePeriod.length === 0 : true
              "
              @click="handleCyclePeriodSettingDone"
            >
              完了
            </SimpleButton>
          </div>
          <div v-else-if="cyclePeriodNowSetting === false" key="endEdit">
            <span>提出日</span>
            <div class="cylcle-period-sammary">
              <div class="cylcle-period-sammary-badges-container">
                <TransitionGroup name="badges">
                  <SimpleTag
                    v-for="sammary in cylclePeriodSammarys"
                    :key="sammary.label"
                    class="cylcle-period-sammary-badges"
                    @remove="handleCyclePeriodDelete(sammary.value)"
                  >
                    {{ sammary.label }}
                  </SimpleTag>
                </TransitionGroup>
              </div>
              <SimpleButton
                class="cylcle-period-edit-button"
                normal
                @click="handleCyclePeriodEdit"
              >
                編集
              </SimpleButton>
            </div>
            <p class="holiday-submit-status">
              {{
                settings.submitOnHoliday
                  ? "※ 祝日は提出しない"
                  : "※ 祝日も提出する"
              }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
    <div class="general-settings">
      <SimpleCard style="margin-bottom: 20px">
        <div class="general-settings-card">
          <div style="text-align: left">
            <SimpleSelector
              caption="提出物のステータス"
              :items="statuses"
              :value="settings.status"
              @change="handleStatusChange"
            />
          </div>
          <div style="position: relative">
            <SimpleCombobox
              caption="割り当てるクラス"
              placeholder="クラスを選択してください"
              :fieldValue="classesComboboxField"
              :items="classes.map((cla) => cla.name)"
              :selectedItems="settings.assignedClasses.map((cla) => cla.name)"
              remove
              multiple
              search
              :error="
                validationErrors.find(
                  (error) =>
                    error === '最低でも1つのクラスを割り当てる必要があります。',
                )
              "
              @fieldChange="handleClassesComboboxFieldChange"
              @remove="handleClassesComboboxFieldRemove"
              @change="handleClassesComboboxSelectChange"
              @floatOpen="hnaldeClassesComboboxFloatOpen"
              @floatClose="hnaldeClassesComboboxFloatClose"
            />
            <div
              v-show="!classesComboboxOpen"
              class="assign-classes-badges-container"
            >
              <TransitionGroup name="classes">
                <SimpleTag
                  v-for="classElm in settings.assignedClasses"
                  :key="classElm.name"
                  class="assign-classes-badges"
                  dark
                  @remove="handleClassesDelete(classElm.name)"
                >
                  {{ classElm.name }}
                </SimpleTag>
              </TransitionGroup>
            </div>
            <!-- <div
              v-show="settings.status === 'draft'"
              style="text-align: left; margin-top: 10px"
            >
              <div class="partition-bar"></div>
              <p v-show="settings.releaseDate !== null">
                公開日時が、{{ releaseDateComputed }}(JST)に設定されています。
              </p>
              <SimpleStack distribution="left">
                <SimpleButton plain @click="handleIsReleseDateSet">
                  公開日時を{{
                    settings.releaseDate === null ? "" : "再"
                  }}設定する
                </SimpleButton>
                <SimpleButton
                  v-show="settings.releaseDate !== null"
                  criticalPlain
                  textColor="rgba(196, 0, 0, 1)"
                  @click="handleIsReleseDateReset"
                >
                  取り消し
                </SimpleButton>
              </SimpleStack>
              <SimpleDateTimePicker
                v-show="isReleseDateSet"
                :initialDatetime="releaseDateTemp"
                :interval="24"
                :inputValue="releaseDateInput"
                @change="handleReleaseDateChange"
              />
              <SimpleStack v-show="isReleseDateSet" distribution="right">
                <SimpleButton plain @click="handleReleaseDateCancel">
                  キャンセル
                </SimpleButton>
                <SimpleButton plain @click="handleReleaseDateDone">
                  設定
                </SimpleButton>
              </SimpleStack>
            </div> -->
          </div>
        </div>
      </SimpleCard>
      <SimpleCard>
        <div class="general-settings-card">
          <SimpleDatePicker
            caption="提出日"
            :initialDate="settings.deadline"
            :disabled="settings.isRepeat"
            :inputValue="settings.isRepeat ? '' : deadlineDateInput"
            :error="
              validationErrors.find(
                (error) => error === '提出日を設定してください。',
              )
            "
            @change="handleDeadlineDateChange"
          />
          <SimpleTimePicker
            caption="締め切り時刻"
            :initialTime="settings.deadline"
            :inputValue="deadlineTimeInput"
            :error="
              validationErrors.find(
                (error) =>
                  error === '締め切り時刻を指定してください。' ||
                  error === '締め切りは未来の時間である必要があります。',
              )
            "
            @change="handleDeadlineTimeChange"
          />
          <div style="text-align: left; margin: 0.25rem 0">
            <SimpleSelector
              caption="提出方法"
              :value="settings.submittionMethod"
              :items="[
                ...submittionMethods.map((data) => ({
                  value: data,
                  label: data,
                })),
                { value: 'other', label: 'その他' },
              ]"
              :error="
                validationErrors.find(
                  (error) => error === '提出方法が設定されていません。',
                )
              "
              @change="handleSubmitMethodChange"
            />
          </div>
          <SimpleInput
            v-show="settings.submittionMethod === 'other'"
            captionHidden
            placeholder="提出方法"
            :value="settings.otherSubmittionMethod || ''"
            :error="
              validationErrors.find(
                (error) => error === 'その他の提出方法を入力してください。',
              )
            "
            @change="handleOtherSubmitMethodChange"
          />
        </div>
      </SimpleCard>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/scss/mixin";
.settings-page-container {
  margin: var(--space-6);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "buttons" "detail" "general";
  @include mixin.mq(md) {
    grid-template-columns: 1fr 380px;
    grid-template-areas: "buttons buttons" "detail general";
  }
}
.button-group {
  grid-area: buttons;
}
.valudation-banner {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border-error);
  padding: var(--space-3) var(--space-2);
  border-radius: var(--border-radius-1);
  background: var(--surface-error-alpha);
  margin-bottom: var(--space-6);
}
.validation-error-header {
  margin-left: var(--space-2);
}
.validation-error-text {
  font-weight: 500;
  padding-top: 2px;
}
.validation-error-list {
  margin: var(--space-2) 0;
  list-style-type: disc;
}
.detail-settings-container {
  padding-top: var(--space-5);
  grid-area: detail;
  text-align: left;
}
.detail-settings {
  max-width: 80%;
  margin: var(--space-5) auto;
}

// cycle period
.cycle-period-container {
  margin: var(--space-2) 0;
}
.submit-on-holiday-checkbox-container {
  margin-left: var(--space-1);
}
.detail-settings-preview-calender {
  text-align: center;
  margin-bottom: var(--space-4);
}
.cylcle-period-sammary {
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.cylcle-period-sammary-badges-container {
  width: 85%;
  display: flex;
  flex-wrap: wrap;
}
.cylcle-period-sammary-badges {
  margin: var(--space-2);
}
.holiday-submit-status {
  margin-left: var(--space-3);
}
.badges-enter-active,
.badges-leave-active {
  position: absolute;
  transition: all 500ms;
}
.badges-enter,
.badges-leave-to {
  opacity: 0;
}
.badges-move {
  transition: all 200ms;
}

.delayed-submittion-deadline {
  width: 50%;
}

.general-settings {
  padding-top: var(--space-5);
  grid-area: general;
}
.general-settings-card {
  padding: var(--space-4) var(--space-10) 0 var(--space-10);
}
.assign-classes-badges {
  margin: var(--space-1);
}
.assign-classes-badges-container {
  padding-top: var(--space-2);
  text-align: left;
}
.partition-bar {
  box-sizing: border-box;
  height: 1px;
  border: 0.5px solid var(--border);
  margin: 10px 0;
}
.classes-leave-active {
  position: absolute;
  transition: all 500ms;
}
.classes-leave-to {
  opacity: 0;
}
.classes-move {
  transition: all 200ms;
}
</style>
