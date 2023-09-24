<script setup lang="ts">
import AssignmentDetailSettings from "@/components/teacher/AssignmentDetailSettings.vue";
import { NullableAssignment } from "@/types/assignments";
import { parseISO } from "date-fns";

const nuxt = useNuxtApp();
const { data, pending } =
  await nuxt.$useAuthenticatedFetch("/api/teacher/rooms");
const handleSave = async (settings: NullableAssignment) => {
  const result = await nuxt.$authenticatedFetch(
    "/api/teacher/assignment/create",
    {
      method: "post",
      body: settings,
    },
  );
  if (result.serial) {
    navigateTo(`/teachers/assignments/${result.serial}/edit`);
  } else {
    nuxt.$showToast({ content: "保存できませんでした", isError: true });
  }
};
</script>
<template>
  <AssignmentDetailSettings
    :initialValue="{
      ...$route.query,
      deadline:
        $route.query.deadline && typeof $route.query.deadline === 'string'
          ? parseISO($route.query.deadline)
          : undefined,
    }"
    :classes="data?.rooms || []"
    :submittionMethods="
      data?.settings?.submittionMethods.map((elm) => elm.method) || []
    "
    :on-save="handleSave"
  />
</template>
