<script setup lang="ts">
import AssignmentView from "@/components/student/AssignmentView.vue";
import { useRoute } from "vue-router";
import { parseISO } from "date-fns";

const route = useRoute();
const computedAssignment = computed(() => {
  if (
    typeof route.query.title === "string" &&
    typeof route.query.deadline === "string"
  ) {
    return {
      title: route.query.title,
      description: route.query.description as string,
      deadline: parseISO(route.query.deadline),
    };
  }
  return null;
});
</script>
<template>
  <div v-if="!computedAssignment"></div>
  <AssignmentView
    v-else
    :previous="`/teachers/assignments/${$route.query.previous}`"
    :assignment="computedAssignment"
  />
</template>
