<script setup lang="ts">
import { SimpleSkeleton } from "@materials";
import EmptyState from "@/components/EmptyState.vue";
import AssignmentResourceCard from "./AssignmentResourceCard.vue";

export interface StudentAssignment {
  serial: number;
  title: string;
  deadline: Date;
  author: string;
}

const props = defineProps({
  loading: {
    type: Boolean,
  },
  assignments: {
    type: Array as PropType<StudentAssignment[]>,
    default: null,
  },
});
</script>
<template>
  <div class="student-main-page">
    <div class="student-main-page-title">{{ $t("assignmentsList") }}</div>
    <div v-if="!loading">
      <div v-if="assignments.length">
        <AssignmentResourceCard
          v-for="assignment in assignments"
          :key="assignment.serial"
          :title="assignment.title"
          :deadline="new Date(assignment.deadline)"
          :author="assignment.author"
          @click="
            () => navigateTo(`/students/assignments/${assignment.serial}`)
          "
        />
      </div>
      <div v-else>
        <EmptyState title="提出物はありません" />
      </div>
    </div>
    <div v-else>
      <SimpleSkeleton
        v-for="index in [...new Array(5).keys()]"
        :key="index"
        :size="{ width: '100%', height: '80px' }"
        style="margin: 4px 0"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.student-main-page {
  margin: var(--space-10);
}
.student-main-page-title {
  text-align: left;
  font-size: var(--font-size-8);
}
</style>
