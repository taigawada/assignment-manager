<script setup lang="ts">
import { SimpleStack, SimpleButton } from "@materials";
import _ from "lodash";

import SettingsPageSkelton from "./SettingsPageSkelton.vue";
import CustomSubmittionMethods from "./CustomSubmittionMethods.vue";

export interface UserSettings {
  submittionMethods: string[];
}
const props = defineProps({
  laoding: Boolean,
  handleSave: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
  settings: {
    type: Object as PropType<UserSettings>,
    required: true,
  },
});
const emits = defineEmits<{
  (e: "change", settings: UserSettings): void;
}>();
const tempSettings = reactive<UserSettings>({
  submittionMethods: [],
});
const initialSettings = ref<UserSettings | null>(null);
onMounted(() => {
  initialSettings.value = { ...props.settings };
  tempSettings.submittionMethods = [...props.settings.submittionMethods];
});
const handleSettingsChange = (newMethods: string[]) => {
  tempSettings.submittionMethods = newMethods;
  if (
    tempSettings.submittionMethods.every((method) => typeof method === "string")
  ) {
    emits("change", { ...props.settings, submittionMethods: newMethods });
  }
};
const dirty = computed(
  () =>
    !_.isEqual(
      _.omit(initialSettings.value, ["__ob__"]),
      _.omit(props.settings, ["__ob__"]),
    ),
);
const submitting = ref(false);
const handleOnSave = async () => {
  submitting.value = true;
  await props.handleSave();
  initialSettings.value = { ...props.settings };
  submitting.value = false;
};
const menus = [
  {
    label: "カスタム提出方法",
    description:
      "生徒の端末上に表示する提出方法をカスタマイズできます。最大7個まで登録可能です。",
    component: markRaw(CustomSubmittionMethods),
  },
];
</script>
<template>
  <div class="detail-settings">
    <div class="save-button">
      <SimpleStack distribution="right">
        <SimpleButton
          primary
          :disabled="!dirty"
          :loading="submitting"
          @click="handleOnSave"
        >
          保存
        </SimpleButton>
      </SimpleStack>
    </div>
    <div
      v-for="settingsElement in menus"
      :key="settingsElement.label"
      class="detail-settings-container"
    >
      <div ref="elementRefs">
        <div class="description-container">
          {{ settingsElement.label }}
          <p>
            {{ settingsElement.description }}
          </p>
        </div>
        <component
          :is="
            props.laoding
              ? markRaw(SettingsPageSkelton)
              : settingsElement.component
          "
          :settings="tempSettings"
          @change="handleSettingsChange"
        ></component>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/scss/mixin";
.save-button {
  width: 90%;
  margin: 0 auto;
  @include mixin.mq(lg) {
    width: 80%;
  }
}
.detail-settings {
  padding-top: var(--space-8);
  height: 100%;
  grid-area: detail;
}
.detail-settings-container {
  margin: 0 auto;
  width: 80%;
}
.description-container {
  text-align: left;
  font-size: var(--font-size-7);
  & p {
    font-size: var(--font-size-3);
  }
}
</style>
