<script setup lang="ts">
import SettingsPage, {
  UserSettings,
} from "@/components/teacher/SettingsPage.vue";

definePageMeta({
  layout: "teacher",
});
const nuxt = useNuxtApp();
const { data, pending, refresh } = await nuxt.$useAuthenticatedFetch(
  "/api/teacher/settings",
);
const settings = reactive<UserSettings>({
  submittionMethods: [],
});
if (data) {
  settings.submittionMethods =
    data.value?.settings?.submittionMethods.map((el) => el.method) || [];
}
const handleChanged = (newSettings: UserSettings) => {
  settings.submittionMethods = newSettings.submittionMethods;
};
const handleSave = async () => {
  const response = await nuxt.$authenticatedFetch("/api/teacher/settings", {
    method: "post",
    body: settings,
  });
  if (response.status === "success") {
    refresh();
  } else {
    nuxt.$showToast({ content: "保存できませんでした", isError: true });
  }
};
</script>
<template>
  <div class="detail-settings">
    <SettingsPage
      :loading="pending && !data"
      :settings="settings"
      @change="handleChanged"
      :handleSave="handleSave"
    />
  </div>
</template>
<style scoped lang="scss">
.detail-settings {
  padding-top: var(--space-8);
}
</style>
