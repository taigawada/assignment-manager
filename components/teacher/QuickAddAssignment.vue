<script setup lang="ts">
import {
  SimpleCard,
  SimpleInput,
  SimpleDateTimePicker,
  SimpleSelector,
} from "@materials";
import { format } from "date-fns";
import { PropType } from "nuxt/dist/app/compat/capi";
import { useQuickAddAssignment } from "./hooks/useQuickAddAssignment";
import TipTapEditor from "../TipTap/TipTapEditor.vue";

export interface QuickAddAssignmentType {
  status: "active";
  title: string;
  description: string | null;
  deadline: Date;
  submittionMethod: string;
}
const nuxt = useNuxtApp();
const props = defineProps({
  submittionMethods: { type: Array as PropType<string[]>, required: true },
  onAdd: {
    type: Function as PropType<
      (object: QuickAddAssignmentType) => Promise<void>
    >,
    required: true,
  },
});
const emits = defineEmits<{
  (
    e: "toDetail",
    object: {
      status: "draft" | "active";
      title: string;
      description: string | null;
      deadline?: string;
      submittionMethod: string;
    },
  ): void;
}>();
const { title, deadline, deadlineInputValue, submitMethod, cantAdd } =
  useQuickAddAssignment();
const submitting = ref(false);
const handleTitleChange = (newValue: string) => {
  title.value = newValue;
};
const handleDeadlineChange = (newValue: Date) => {
  deadline.value = newValue;
  deadlineInputValue.value = format(newValue, "yyyy年MM月dd日HH時mm分");
};
const handleMethodChange = (newValue: string) => {
  submitMethod.value = newValue;
};
const discription = ref<string>("");
const handleDiscriptionChange = (newValue: string) => {
  discription.value = newValue;
};
const toDetailSettings = () => {
  emits("toDetail", {
    status: "active",
    title: title.value,
    description: discription.value,
    deadline: deadline.value?.toISOString(),
    submittionMethod: submitMethod.value,
  });
};
const handleAdd = async () => {
  if (deadline.value) {
    submitting.value = true;
    await props.onAdd({
      status: "active",
      title: title.value,
      description: discription.value,
      deadline: deadline.value,
      submittionMethod: submitMethod.value,
    });
    submitting.value = false;
  } else {
    nuxt.$showToast({ content: "追加できませんでした", isError: true });
  }
};
</script>
<template>
  <SimpleCard
    class="quick-add-assigment-card"
    :mainAction="{
      label: '追加',
      disabled: cantAdd,
      loading: submitting,
      onAction: handleAdd,
    }"
    :subAction="{
      label: '詳細設定',
      onAction: toDetailSettings,
    }"
  >
    <div class="quick-add-assigment-card-content">
      <SimpleInput
        :value="title"
        :maxlength="title.length < 40 ? undefined : 50"
        caption="提出物タイトル"
        @change="handleTitleChange"
      />
      <SimpleDateTimePicker
        caption="提出期限"
        :initial-datetime="deadline"
        :inputValue="deadlineInputValue"
        @change="handleDeadlineChange"
      />
      <SimpleSelector
        caption="提出方法"
        :value="submitMethod"
        :items="
          submittionMethods.map((method) => ({ label: method, value: method }))
        "
        @change="handleMethodChange"
      />
      <TipTapEditor
        caption="説明"
        placeholder="説明を入力..."
        :value="discription"
        @change:editor="handleDiscriptionChange"
      />
    </div>
  </SimpleCard>
</template>
<style scoped lang="scss">
.quick-add-assigment-card {
  margin-top: var(--space-3);
  text-align: left;
}
.quick-add-assigment-card-content {
  padding: var(--space-10) var(--space-10) var(--space-5) var(--space-10);
}
</style>
