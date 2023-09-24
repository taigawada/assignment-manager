<script setup lang="ts">
import {
  SimplePagination,
  SimpleButton,
  SimpleResourceList,
  ResourceItem,
  SimpleModal,
  SimpleTag,
  SimpleSkeleton,
} from "@materials";
import { GabbageBox } from "@materials/icons";
import { statusTranslate } from "@/utils/translate";
import { format, isFuture } from "date-fns";

export interface ResourceListAssignment {
  id: number;
  serial: number;
  title: string;
  status: string;
  deadline: Date;
  assignedClasses: {
    id: number;
    name: string;
  }[];
}
const route = useRoute();
const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  assignments: {
    type: Array as PropType<ResourceListAssignment[]>,
    required: true,
  },
  onDelete: {
    type: Function as PropType<(ids: number[]) => Promise<void>>,
    required: true,
  },
});
// resource list logics
const resourceListSelected = ref<number[]>([]);
const handleResourceListChange = (newArray: number[]) => {
  resourceListSelected.value = newArray;
};
const onClickRow = (index: number) => {
  navigateTo(
    `/teachers/assignments/${props.assignments[index].serial}/${
      props.assignments[index].status === "draft" ? "edit" : "status"
    }`,
  );
};

// delete warning modal
const deleteWarningModalWaiter = ref<null | Function>(null);
const deleteWarningModalOpen = ref(false);
const handleDeleteWarningMainAction = () => {
  if (deleteWarningModalWaiter.value) {
    deleteWarningModalWaiter.value(true);
  }
  deleteWarningModalOpen.value = false;
};
const handleDeleteWarningModalDestroy = () => {
  if (deleteWarningModalWaiter.value) {
    deleteWarningModalWaiter.value(false);
  }
  deleteWarningModalOpen.value = false;
};
const handleAssignmentDelete = async (ids: number[]) => {
  deleteWarningModalOpen.value = true;
  const result = await new Promise((resolve) => {
    deleteWarningModalWaiter.value = resolve;
  });
  if (result) {
    await props.onDelete(ids);
  }
};
const loadingResource = [...new Array(6).keys()].map((index) => ({
  id: index,
}));
const currentPage = ref((route.query.page || 1) - 1);
const handleNextPage = () => {
  currentPage.value += 1;
};
const handlePreviousPage = () => {
  currentPage.value -= 1;
};
const handlePageChange = (page: number) => {
  currentPage.value = page;
};
const popoverMenuOpen = ref<number | null>(null);
const handlePopoverMenuOpen = (id: number) => {
  if (popoverMenuOpen.value !== null) {
    popoverMenuOpen.value = null;
  } else {
    popoverMenuOpen.value = id;
  }
};
const handlePopoverMenuClose = () => {
  popoverMenuOpen.value = null;
};
const handleEdit = (serial: number) => {
  navigateTo(`teachers/assignments/${serial}/edit`);
};
</script>
<template>
  <div>
    <SimpleResourceList
      :items="loading ? loadingResource : assignments"
      select
      :selectedItems="resourceListSelected"
      :weight="[4, 1, 2, 1]"
      :onClickItem="onClickRow"
      @change="handleResourceListChange"
    >
      <template #header>
        <ResourceItem distribution="left"> タイトル </ResourceItem>
        <ResourceItem> 提出期限 </ResourceItem>
        <ResourceItem>ステータス</ResourceItem>
        <ResourceItem />
      </template>
      <template #headerActions>
        <SimpleButton
          criticalPlain
          :icon="GabbageBox"
          iconSide="left"
          @click="() => handleAssignmentDelete(resourceListSelected)"
        >
          削除する
        </SimpleButton>
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
            {{
              format(
                render.item.deadline,
                $isMobile.value ? "MM月dd日 HH:mm" : "yyyy年MM月dd日 HH:mm",
              )
            }}
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
        <ResourceItem
          :mobile="$isMobile.value"
          :keyId="render.item.id"
          popoverMenu
          :popoverMenuOpen="popoverMenuOpen || undefined"
          @toggle="() => handlePopoverMenuOpen(render.item.id)"
          @close="handlePopoverMenuClose"
        >
          <div class="other-operation-actions-container">
            <div
              v-show="isFuture(render.item.deadline)"
              class="other-operation-action"
              @click.stop="() => handleEdit(render.item.serial)"
            >
              編集する
            </div>
            <div
              class="other-operation-action to-gabbage-text"
              @click.stop="handleAssignmentDelete([render.item.id])"
            >
              削除する
            </div>
          </div>
        </ResourceItem>
      </template>
      <template #pagination>
        <SimplePagination
          :length="pageCount"
          :current="currentPage"
          @next="handleNextPage"
          @previous="handlePreviousPage"
          @change="handlePageChange"
        ></SimplePagination>
      </template>
    </SimpleResourceList>
    <SimpleModal
      :open="deleteWarningModalOpen"
      title="提出物を削除する"
      :mainAction="{
        text: '削除',
        isCritical: true,
        onAction: handleDeleteWarningMainAction,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: handleDeleteWarningModalDestroy,
      }"
      @destroy="handleDeleteWarningModalDestroy"
    >
      <p style="text-align: left">この操作は取り消せません。</p>
    </SimpleModal>
  </div>
</template>
<style scoped lang="scss">
.other-operation-actions-container {
  padding: var(--space-1);
}
.other-operation-action {
  $action-height: 40px;
  height: $action-height;
  line-height: $action-height;
  padding: 0 var(--space-5);
}
.other-operation-action:hover {
  background: var(--hovered);
}
.to-gabbage-text {
  color: var(--text-error);
}
</style>
