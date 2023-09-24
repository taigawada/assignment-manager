<script setup lang="ts">
import AssignmentDetailSettings from "@/components/teacher/AssignmentDetailSettings.vue";
import { CyclePeriod, NullableAssignment } from "@/types/assignments";
import { parseISO } from "date-fns";

const nuxt = useNuxtApp();
const route = useRoute();
const { id }: { id: string } = route.params;
const { data, pending } = await nuxt.$useAuthenticatedFetch(
  `/api/teacher/assignment/${id}` as "/api/teacher/assignment/:id",
);
const cyclePeriod = computed(() => {
  if (data.value?.assignment?.cyclePeriod) {
    return data.value.assignment.cyclePeriod as unknown as CyclePeriod[];
  }
  return undefined;
});

const handleSave = async (settings: NullableAssignment) => {
  const result = await nuxt.$authenticatedFetch(
    "/api/teacher/assignment/update",
    {
      method: "post",
      body: settings,
    },
  );
  if (result.status === "error") {
    nuxt.$showToast({ content: "保存できませんでした", isError: true });
  }
};
</script>
<template>
  <div v-if="pending || !data?.assignment || !data.settings || !data.rooms">
    loading...
  </div>
  <AssignmentDetailSettings
    v-else
    :initialValue="
      {
        ...data.assignment,
        deadline: parseISO(data.assignment.deadline),
        cyclePeriod,
      } as NullableAssignment
    "
    :classes="data.rooms"
    :submittionMethods="
      data.settings.submittionMethods.map((elm) => elm.method)
    "
    :onSave="handleSave"
  />
</template>
<style scoped lang="scss"></style>
