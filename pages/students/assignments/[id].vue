<script setup lang="ts">
import AssignmentView from "@/components/student/AssignmentView.vue";
import { useRoute } from "vue-router";
import { parseISO } from "date-fns";

const route = useRoute();
const { id } = route.params;
const nuxt = useNuxtApp();
const { data, pending } = await nuxt.$useAuthenticatedFetch(
  `/api/student/assignment/${id}` as "/api/student/assignment/:id",
);
const computedAssignment = computed(() => {
  if (data.value && data.value.assignment) {
    return {
      title: data.value.assignment.title,
      description: data.value.assignment.description,
      deadline: parseISO(data.value.assignment.deadline),
    };
  }
});
</script>
<template>
  <AssignmentView
    previous="/students"
    :loading="pending"
    :assignment="computedAssignment"
  />
</template>
