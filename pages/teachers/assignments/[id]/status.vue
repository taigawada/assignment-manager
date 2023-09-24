<script setup lang="ts">
import SubmittionStatus from "@/components/teacher/SubmittionStatus.vue";
import SubmittionStatusList from "@/components/teacher/SubmittionStatusList.vue";
import { useRoute } from "vue-router";
import { parseISO } from "date-fns";

const nuxt = useNuxtApp();
const route = useRoute();

const currentIndex = computed(() =>
  parseInt(typeof route.query.index === "string" ? route.query.index : "0", 10),
);

const handleIndexChange = (index: number) => {
  navigateTo({ path: route.path, query: { index } });
};

const { data, pending } = await nuxt.$useAuthenticatedFetch(
  `/api/teacher/assignment/status/${route.params.id}` as "/api/teacher/assignment/status/:id",
  { query: { index: currentIndex } },
);

const computedAssignment = computed(() => {
  if (data.value?.assignment) {
    return {
      title: data.value.assignment.title,
      assignedClasses: data.value.assignment.assignedClasses,
      status: data.value.assignment.status,
      deadline: parseISO(data.value.assignment.deadline),
    };
  }
  return null;
});
const computedStudents = computed(() => {
  if (data.value?.room?.length === 1) {
    const room = data.value.room[0];
    return room.students.map((student) => ({
      id: student.id,
      name: student.name,
      syussekiNo: student.syussekiNo,
      className: room.name,
      submittedAt: student.Submittions.length
        ? student.Submittions[0].submittedAt
          ? parseISO(student.Submittions[0].submittedAt)
          : null
        : null,
    }));
  }
  return [];
});
</script>
<template>
  <SubmittionStatus
    :loading="pending || !data"
    :tab-index="currentIndex"
    :previous="($route.query.previous as string) || '/teachers/assignments'"
    :assignment="computedAssignment"
    :summary="data ? data.summary : null"
    @change:tab="handleIndexChange"
  />
  <SubmittionStatusList
    :loading="pending || !data"
    :students="computedStudents"
  />
</template>
<style scoped lang="scss"></style>
