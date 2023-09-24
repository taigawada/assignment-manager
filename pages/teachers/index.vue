<script setup lang="ts">
import Landing from "@/components/teacher/Landing.vue";
import { QuickAddAssignmentType } from "@/components/teacher/QuickAddAssignment.vue";
import { parseISO } from "date-fns";

const nuxt = useNuxtApp();

definePageMeta({
  layout: "teacher",
});
const { data, pending, refresh } = await nuxt.$useAuthenticatedFetch(
  "/api/teacher/assignment/todays",
);

const handleAdd = async (object: QuickAddAssignmentType) => {
  const result = await nuxt.$authenticatedFetch(
    "/api/teacher/assignment/create",
    {
      method: "post",
      body: {
        ...object,
        isRepeat: false,
        submitOnHoliday: false,
        assignedClasses: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        cyclePeriod: [],
      },
    },
  );
  if (result.serial) {
    navigateTo(`/teachers/assignments/${result.serial}/edit`);
  } else {
    nuxt.$showToast({ content: "追加できませんでした", isError: true });
  }
};
const handleAssignmentDelete = async (ids: number[]) => {
  const result = await nuxt.$authenticatedFetch(
    "/api/teacher/assignment/delete",
    {
      method: "delete",
      body: ids,
    },
  );
  if (result.status === "success") {
    await refresh();
  }
};
</script>
<template>
  <Landing
    :loading="pending"
    :submittion-methods="
      data?.settings?.submittionMethods.map((elm) => elm.method) || []
    "
    :assignments="
      data?.assignments?.map((assignment) => ({
        id: assignment.id,
        serial: assignment.serial,
        title: assignment.title,
        status: assignment.status,
        deadline: parseISO(assignment.deadline),
      })) || []
    "
    :on-add="handleAdd"
    :on-delete="handleAssignmentDelete"
  />
</template>
