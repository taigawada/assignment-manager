<script setup lang="ts">
import {
  SimpleTag,
  SimpleResourceList,
  ResourceItem,
  SimpleSkeleton,
} from "@materials";
import { format } from "date-fns";

export interface SubmittionStatusStudents {
  id: number;
  submittedAt: Date | null;
  name: string;
  syussekiNo: number;
  className: string;
}

const props = defineProps({
  loading: {
    type: Boolean,
  },
  students: {
    type: Array as PropType<SubmittionStatusStudents[]>,
    required: true,
  },
});
const loadingResources = ref(new Array(30).fill({}));
const resourceListSelected = ref<number[]>([]);
const handleResourceListChange = (newSelected: number[]) => {
  resourceListSelected.value = newSelected;
};
</script>
<template>
  <div class="container">
    <SimpleResourceList
      :items="loading ? loadingResources : students"
      select
      :selectedItems="resourceListSelected"
      :weight="[2, 2, 6, 6, 2, 1]"
      @change="handleResourceListChange"
    >
      <template #header>
        <ResourceItem>クラス</ResourceItem>
        <ResourceItem>出席番号</ResourceItem>
        <ResourceItem distribution="left"> 氏名 </ResourceItem>
        <ResourceItem>提出日時</ResourceItem>
        <ResourceItem>ステータス</ResourceItem>
      </template>
      <template #data="render">
        <ResourceItem>
          <component
            :is="!loading ? 'span' : markRaw(SimpleSkeleton)"
            type="text"
          >
            {{ render.item.className }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="!loading ? 'span' : markRaw(SimpleSkeleton)"
            type="text"
          >
            {{ render.item.syussekiNo }}
          </component>
        </ResourceItem>
        <ResourceItem :distribution="render.item.name ? 'left' : 'center'">
          <component
            :is="!loading ? 'span' : markRaw(SimpleSkeleton)"
            type="text"
          >
            {{ render.item.name }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="!loading ? 'span' : markRaw(SimpleSkeleton)"
            type="text"
          >
            {{
              render.item.submittedAt
                ? format(render.item.submittedAt, "yyyy年MM月dd日HH時mm分")
                : "N/A"
            }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="!loading ? markRaw(SimpleTag) : markRaw(SimpleSkeleton)"
            :warn="render.item.submittedAt === null"
            :success="render.item.submittedAt !== null"
            :remove="false"
            type="text"
          >
            <span style="font-size: 0.825rem">{{
              render.item.submittedAt === null ? "未提出" : "提出済み"
            }}</span>
          </component>
        </ResourceItem>
      </template>
    </SimpleResourceList>
  </div>
</template>
<style scoped lang="scss">
.container {
  padding: 0 var(--space-6) var(--space-6) var(--space-6);
}
</style>
