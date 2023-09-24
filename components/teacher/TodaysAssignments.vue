<script setup lang="ts">
import {
  SimpleStack,
  SimpleResourceList,
  ResourceItem,
  SimpleTag,
  SimpleSkeleton,
} from "@materials";
import { useRoute } from "vue-router";
import { format, isPast } from "date-fns";
import { statusTranslate } from "@/utils/translate";

export interface ResourceListAssignment {
  id: number;
  serial: number;
  title: string;
  status: string;
  deadline: Date;
}
const route = useRoute();
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  assignments: {
    type: Array as PropType<ResourceListAssignment[]>,
    required: true,
  },
});
const onClickRow = (index: number) => {
  navigateTo({
    path: `/teachers/assignments/${props.assignments[index].serial}/${
      isPast(props.assignments[index].deadline) ? "status" : "edit"
    }`,
    query: {
      previous: route.fullPath,
    },
  });
};

const loadingResource = [...new Array(6).keys()].map((index) => ({
  id: index,
}));
</script>
<template>
  <div>
    <div class="assignments-resource-list-header">
      <SimpleStack distribution="spaceBetween" alignment="upper">
        <SimpleStack
          distribution="spaceBetween"
          alignment="center"
          spacing="15px"
        >
          <span class="assignments-resource-list-title">
            今日が締め切りの提出物
          </span>
        </SimpleStack>
      </SimpleStack>
    </div>
    <SimpleResourceList
      :items="props.loading ? loadingResource : assignments"
      :weight="[4, 3, 2]"
      :onClickItem="onClickRow"
    >
      <template #header>
        <ResourceItem distribution="left"> タイトル </ResourceItem>
        <ResourceItem> 提出期限 </ResourceItem>
        <ResourceItem>ステータス</ResourceItem>
      </template>
      <template #data="render">
        <ResourceItem :distribution="render.item.title ? 'left' : 'center'">
          <component
            :is="render.item.title ? 'span' : markRaw(SimpleSkeleton)"
            class="resource-list-text"
            type="text"
          >
            {{ render.item.title }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="render.item.deadline ? 'span' : markRaw(SimpleSkeleton)"
            type="text"
          >
            {{ format(render.item.deadline, "MM月dd日 HH:mm") }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="
              render.item.status ? markRaw(SimpleTag) : markRaw(SimpleSkeleton)
            "
            :processing="
              statusTranslate(render.item.status, render.item.deadline)
                ?.processing
            "
            :success="
              statusTranslate(render.item.status, render.item.deadline)?.success
            "
            :warn="
              statusTranslate(render.item.status, render.item.deadline)?.warn
            "
            :remove="false"
            type="text"
          >
            <span>{{
              statusTranslate(render.item.status, render.item.deadline)?.label
            }}</span>
          </component>
        </ResourceItem>
      </template>
    </SimpleResourceList>
  </div>
</template>
<style scoped lang="scss">
.assignments-resource-list-header {
  padding: var(--space-3);
}
.assignments-resource-list-title {
  margin-right: var(--space-2);
  font-size: var(--font-size-8);
}
.other-operation-actions-container {
  display: inline-block;
  width: max-content;
  padding: var(--space-1);
}
.other-operation-action {
  $action-height: 35px;
  height: $action-height;
  line-height: $action-height;
  padding: 0 var(--space-8);
  font-size: var(--font-size-3);
}
.other-operation-action:hover {
  background: var(--hovered);
}
.to-gabbage-text {
  color: var(--text-error);
}
</style>
