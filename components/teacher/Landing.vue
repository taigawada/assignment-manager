<script setup lang="ts">
import { SimpleButton } from "@materials";
import GreetingCard from "@/components/teacher/cards/GreetingCard.vue";
import QuickAddAssignment, {
  QuickAddAssignmentType,
} from "@/components/teacher/QuickAddAssignment.vue";
import AssignmentResourcelist, {
  ResourceListAssignment,
} from "@/components/teacher/TodaysAssignments.vue";
import EmptyState from "@/components/EmptyState.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  submittionMethods: {
    type: Array as PropType<string[]>,
    required: true,
  },
  assignments: {
    type: Array as PropType<ResourceListAssignment[]>,
    required: true,
  },
  onAdd: {
    type: Function as PropType<
      (object: QuickAddAssignmentType) => Promise<void>
    >,
    required: true,
  },
  onDelete: {
    type: Function as PropType<(ids: number[]) => Promise<void>>,
    required: true,
  },
});
const handleDetail = (object: {
  status: "draft" | "active";
  title: string;
  description: string | null;
  deadline?: string;
  submittionMethod: string;
}) => {
  navigateTo({ path: "/teachers/assignments/new", query: { ...object } });
};
const handleNewAssignment = () => {
  navigateTo("/teachers/assignments/new");
};
</script>
<template>
  <div class="container">
    <div class="left-content">
      <GreetingCard />
      <EmptyState
        v-if="assignments.length === 0"
        title="今日までの提出物はありません"
      />
      <AssignmentResourcelist
        v-else
        :loading="loading"
        :assignments="props.assignments"
        :on-delete="onDelete"
      />
    </div>
    <div class="add-button">
      <SimpleButton primary fill @click="handleNewAssignment"
        >提出物を追加</SimpleButton
      >
    </div>
    <div class="right-content">
      <QuickAddAssignment
        :submittion-methods="submittionMethods"
        :on-add="onAdd"
        @to-detail="handleDetail"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/scss/mixin";
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "add-button" "left-content" "right-content";
  @include mixin.mq(md) {
    padding: 0 var(--space-6);
    grid-template-areas:
      "left-content add-button"
      "left-content right-content";
    grid-template-columns: 2fr 380px;
  }
}
.left-content {
  grid-area: left-content;
  width: 95%;
  margin: 0 auto;
}
.add-button {
  grid-area: add-button;
  margin-top: var(--space-6);
  text-align: center;
}
.right-content {
  grid-area: right-content;
  width: 95%;
  margin: 0 auto;
}
</style>
