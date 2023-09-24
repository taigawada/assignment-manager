<script setup lang="ts">
import { SimpleTabs } from "@materials";
import { useRoute } from "vue-router";
import Default from "./default.vue";

const route = useRoute();
const tabs = [
  {
    label: "提出物管理",
    id: "manage-assignment",
    url: "/teachers",
  },
  {
    label: "提出物一覧",
    id: "list-of-assignment",
    url: "/teachers/assignments",
  },
  {
    label: "設定",
    id: "teacher-settings",
    url: "/teachers/settings",
  },
];
const selectedTab = ref(
  tabs.findIndex((tab) => tab.url === route.path.split("?")[0]),
);
const handleSelectedTabChange = (index: number) => {
  selectedTab.value = index;
  switch (index) {
    case 0:
      navigateTo("/teachers");
      break;
    case 1:
      navigateTo("/teachers/assignments?page=1");
      break;
    case 2:
      navigateTo("/teachers/settings");
      break;
    default:
      break;
  }
};
</script>
<template>
  <Default>
    <SimpleTabs
      :tabs="tabs"
      :selected="selectedTab"
      @change="handleSelectedTabChange"
    />
    <slot></slot>
  </Default>
</template>
