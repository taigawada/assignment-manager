<script setup lang="ts">
import AssignmentsList from "@/components/teacher/AssignmentsList.vue";
import EmptyState from "@/components/EmptyState.vue";
import { parseISO } from "date-fns";

definePageMeta({
  layout: "teacher",
});

const nuxt = useNuxtApp();
const route = useRoute();
const { data, pending, refresh } = await nuxt.$useAuthenticatedFetch(
  "/api/teacher/assignment/get",
  { query: route.query },
);
const computedAssignments = computed(() => {
  if (data.value?.assignments) {
    return data.value.assignments.map((assignment) => ({
      id: assignment.id,
      serial: assignment.serial,
      title: assignment.title,
      status: assignment.status,
      deadline: parseISO(assignment.deadline),
      assignedClasses: assignment.assignedClasses,
    }));
  }
  return [];
});
const handleDelete = async (ids: number[]) => {};
</script>
<template>
  <div class="container">
    <AssignmentsList
      v-if="computedAssignments.length"
      :page-count="Math.ceil((data?.count || 1) / 10)"
      :loading="false"
      :assignments="computedAssignments"
      :on-delete="handleDelete"
    />
    <EmptyState v-else title="提出物が設定されていません" />
  </div>
</template>
<style scoped lang="scss">
.container {
  margin: var(--space-6);
}
</style>
