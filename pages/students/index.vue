<script setup lang="ts">
import Landing from "@/components/student/Landing.vue";
import { validCyclePeriod } from "@/types/typeGuard";
import { parseISO } from "date-fns";
import { useNextSubmit } from "@/components/student/hooks/useNextSubmit";
import { holidayKey } from "@/types/injectionKeys";

const nuxt = useNuxtApp();
const { data, pending } = await nuxt.$useAuthenticatedFetch(
  "/api/student/assignment/future",
);
const holidays = inject(holidayKey, []);
const computedAssignments = computed(() => {
  if (data.value?.assignments) {
    const assignments = data.value.assignments.map((assignment) => {
      const rest = {
        serial: assignment.serial,
        title: assignment.title,
        deadline: parseISO(assignment.deadline),
        author: assignment.Teachers?.name || "",
      };
      if (assignment.isRepeat) {
        const { cyclePeriod }: any = assignment;
        if (validCyclePeriod(cyclePeriod)) {
          const nextSubmit = useNextSubmit(
            holidays,
            cyclePeriod,
            rest.deadline,
            assignment.submitOnHoliday,
          );
          return {
            ...rest,
            deadline: nextSubmit,
          };
        }
      }
      return rest;
    });
    return assignments.sort(
      (a, b) => a.deadline.getTime() - b.deadline.getTime(),
    );
  }
  return [];
});
</script>
<template>
  <Landing :loading="pending" :assignments="computedAssignments" />
</template>
