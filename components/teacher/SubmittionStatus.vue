<script setup lang="ts">
import {
  SimpleButton,
  SimpleTabs,
  SimpleStack,
  SimpleIcon,
  SimpleTag,
  SimpleSkeleton,
} from "@materials";
import { ArrowLeft, ArrowTrendDown, ArrowTrendUp } from "@materials/icons";
import { statusTranslate } from "@/utils/translate";
import { PropType } from "nuxt/dist/app/compat/capi";

export interface SubmittionStatusSummary {
  notSubmitted: number;
  percentageNotSubmitted: number;
  allPercentageNotSubmitted: number;
  CumulativeAllPercentageNotSubmitted: number;
  CumulativeAllPercentageNotSubmittedDelta: number;
}

export interface SubmittionStatusAssignment {
  assignedClasses: {
    id: number;
    year: number;
    name: string;
    schoolId: number;
  }[];
  title: string;
  status: string;
  deadline: Date;
}

const props = defineProps({
  loading: {
    type: Boolean,
  },
  tabIndex: {
    type: Number,
    required: true,
  },
  previous: {
    type: String,
    required: true,
  },
  assignment: {
    type: Object as PropType<SubmittionStatusAssignment | null>,
    default: null,
  },
  summary: {
    type: Object as PropType<SubmittionStatusSummary | null>,
    default: null,
  },
});
const emits = defineEmits<{
  (e: "change:tab", index: number): void;
}>();

const handlePreviousPage = () => {
  navigateTo(props.previous);
};
const isLoading = ref(false);
const classes = computed(() => {
  if (props.assignment) {
    return props.assignment.assignedClasses.map((classElm) => ({
      id: `${classElm.id}`,
      label: classElm.name,
    }));
  }
  return null;
});
const statusLabel = computed(() => {
  if (props.assignment) {
    return statusTranslate(props.assignment.status, props.assignment.deadline)
      ?.label;
  }
  return "";
});
const handleClassesTabSelect = (select: number) => {
  emits("change:tab", select);
};
const cumulativeAvg = computed(() => 0);
const cumulativeAvgColor = computed(() => {
  if (props.summary) {
    if (props.summary.CumulativeAllPercentageNotSubmittedDelta < 0) {
      return { color: "rgba(196, 0, 0, 1)" };
    }
    return { color: "rgba(0, 128, 96, 1)" };
  }
  return { color: "rgba(0, 0, 0, 1)" };
});
</script>
<template>
  <div class="submittion-status-container">
    <div class="submittion-status-header">
      <SimpleStack alignment="center" distribution="left">
        <SimpleButton
          normal
          :icon="ArrowLeft"
          iconSide="left"
          @click="handlePreviousPage"
        >
          戻る
        </SimpleButton>
        <div class="submittion-status-header-text">
          {{ assignment?.title }}
        </div>
        <SimpleTag v-show="!isLoading" success :remove="false">
          <span style="font-size: 0.825rem">{{ statusLabel }}</span>
        </SimpleTag>
      </SimpleStack>
    </div>
    <div class="submittion-status-summary-container">
      <div class="class-tab-base">
        <SimpleTabs
          :tabs="classes ? classes : [{ id: 'null', label: '-' }]"
          :selected="tabIndex"
          color="rgba(44, 62, 80, 1)"
          textColor="rgba(44, 62, 80, 1)"
          @change="handleClassesTabSelect"
        ></SimpleTabs>
      </div>
      <div class="submittion-status-summary">
        <div class="submittion-status-summary-box">
          <span
            class="status-summary-header"
            :size="{
              width: '40px',
              height: '10px',
            }"
          >
            未提出
          </span>
          <component
            :is="loading ? markRaw(SimpleSkeleton) : 'div'"
            class="summary-result-container"
            :size="{
              width: '120px',
              height: '27px',
            }"
          >
            <div
              class="summary-result"
              style="font-size: 18px; margin-right: 16px"
            >
              {{ summary?.notSubmitted }}人
            </div>
          </component>
        </div>
        <div class="submittion-status-summary-box">
          <span
            class="status-summary-header"
            :size="{
              width: '40px',
              height: '10px',
            }"
          >
            提出率
          </span>
          <component
            :is="loading ? markRaw(SimpleSkeleton) : 'div'"
            class="summary-result-container"
            :size="{
              width: '120px',
              height: '27px',
            }"
          >
            <div class="summary-result">
              {{ summary?.percentageNotSubmitted }}%
            </div>
          </component>
        </div>
        <div class="submittion-status-summary-box">
          <span
            class="status-summary-header"
            :size="{
              width: '40px',
              height: '10px',
            }"
          >
            全体平均提出率
          </span>
          <component
            :is="loading ? markRaw(SimpleSkeleton) : 'div'"
            class="summary-result-container"
            :size="{
              width: '120px',
              height: '27px',
            }"
          >
            <div class="summary-result">
              {{ summary?.allPercentageNotSubmitted }}%
            </div>
          </component>
        </div>
        <div class="submittion-status-summary-box">
          <span
            class="status-summary-header"
            :size="{
              width: '40px',
              height: '10px',
            }"
          >
            累積平均提出率
          </span>
          <component
            :is="loading ? markRaw(SimpleSkeleton) : 'div'"
            class="summary-result-container"
            :size="{
              width: '120px',
              height: '27px',
            }"
          >
            <div class="summary-result" style="margin-right: 16px">
              {{ summary?.CumulativeAllPercentageNotSubmitted }}%
            </div>
            <div :style="cumulativeAvgColor">
              {{
                summary
                  ? Math.abs(summary.CumulativeAllPercentageNotSubmittedDelta)
                  : 0
              }}%
            </div>
            <SimpleIcon
              :source="cumulativeAvg <= 0 ? ArrowTrendDown : ArrowTrendUp"
              :fill="cumulativeAvgColor.color"
            />
          </component>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.submittion-status-container {
  text-align: center;
  padding: 0 var(--space-6) var(--space-6) var(--space-6);
}
.submittion-status-header {
  padding: var(--space-4) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.submittion-status-header-text {
  font-size: var(--font-size-8);
  margin: 0 var(--space-4);
}
.class-tab-base {
  position: relative;
  padding-right: var(--tab-width);
  z-index: 0;
}
.class-tab-base::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  display: block;
  border-bottom: 1px solid var(--border);
  z-index: -1;
}
.submittion-status-summary-container {
  border-radius: var(--border-radius-1);
  margin-bottom: var(--space-4);
  background-image: linear-gradient(
    135deg,
    rgb(219, 229, 255),
    rgb(234, 255, 238)
  );
}
.submittion-status-summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.submittion-status-summary-box {
  padding: var(--space-4) 0;
  color: #000000;
}
.status-summary-header {
  font-size: var(--font-size-4);
  margin-bottom: 10px;
}
.summary-result-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary-result {
  font-size: var(--font-size-7);
}
</style>
