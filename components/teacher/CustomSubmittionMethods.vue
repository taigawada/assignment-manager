<script setup lang="ts">
import { SimpleInput, SimpleIcon } from "@materials";
import { DndHandler, DeleteCross } from "@materials/icons";
import {
  useMouse,
  useEventListener,
  useWindowScroll,
  useScrollLock,
} from "@vueuse/core";
import { CSSProperties } from "nuxt/dist/app/compat/capi";
import { UserSettings } from "./SettingsPage.vue";

const props = defineProps({
  settings: {
    type: Object as PropType<UserSettings>,
    required: true,
  },
});
const emits = defineEmits<{
  (e: "change", array: string[]): void;
}>();
const focusTrigger = ref(false);
const newValue = ref("");
const handleNewValueFieldFocus = () => {
  if (
    props.settings.submittionMethods.every((value) => value !== "") &&
    props.settings.submittionMethods.length < 7
  ) {
    emits("change", [...props.settings.submittionMethods, ""]);
    focusTrigger.value = true;
  }
};
const handleFocusout = () => {
  const deleteEmpty = props.settings.submittionMethods.filter(
    (value) => value !== "",
  );
  emits("change", deleteEmpty);
};

const handleMethodChange = (value: string, index: number) => {
  const copyArray = [...props.settings.submittionMethods];
  copyArray.splice(index, 1, value);
  emits("change", copyArray);
};
const handleMethodDelete = (index: number) => {
  const copyArray = [...props.settings.submittionMethods];
  copyArray.splice(index, 1);
  emits("change", copyArray);
};
const customSubmittionMethodsContainer = ref<HTMLElement | null>(null);
const isLocked = useScrollLock(customSubmittionMethodsContainer);
const hoveredElements = ref<HTMLElement[] | null>(null);
const isDragging = ref<number | null>(null);
const currentHoverRef = computed(() =>
  // eslint-disable-next-line no-nested-ternary
  isDragging.value !== null
    ? hoveredElements.value
      ? hoveredElements.value[isDragging.value]
      : null
    : null,
);
const mousePosition = useMouse();
const draggingElement = reactive({
  x: 0,
  y: 0,
});
const windowScroll = useWindowScroll(window);
const offset = ref(0);
const changeIndex = ref(0);
watch(mousePosition.y, () => {
  if (isDragging.value !== null) {
    const amount = mousePosition.y.value - windowScroll.y.value - offset.value;
    draggingElement.y = amount;
    if (hoveredElements.value) {
      const positionsArray = hoveredElements.value.map((elm) => {
        return elm.getBoundingClientRect().top;
      });
      positionsArray.splice(isDragging.value, 1);
      positionsArray.push(amount);
      positionsArray.sort();
      const resultIndex = positionsArray.findIndex((top) => top === amount);
      if (resultIndex < props.settings.submittionMethods.length)
        changeIndex.value = resultIndex;
    }
  } else {
    draggingElement.y = 0;
  }
});
watch(changeIndex, () => {
  if (isDragging.value !== null) {
    const copyElement = props.settings.submittionMethods[isDragging.value];
    const copyArray = [...props.settings.submittionMethods];
    copyArray.splice(isDragging.value, 1);
    isDragging.value = changeIndex.value;
    copyArray.splice(isDragging.value, 0, copyElement);
    emits("change", copyArray);
  }
});

const draggableStyle = computed<CSSProperties>(() => ({
  position: isDragging.value !== null ? "fixed" : "initial",
  top:
    isDragging.value !== null
      ? `${
          draggingElement.y
            ? draggingElement.y
            : currentHoverRef.value?.getBoundingClientRect().top!
        }px`
      : "0",
  width: `${customSubmittionMethodsContainer.value?.getBoundingClientRect()
    .width}px`,
  zIndex: isDragging.value !== null ? "100" : "0",
}));
const cleanupfunc = ref<(() => void) | null>(null);
const handleDragEnd = () => {
  isLocked.value = false;
  if (cleanupfunc.value !== null) {
    cleanupfunc.value();
    cleanupfunc.value = null;
  }
  emits(
    "change",
    [...props.settings.submittionMethods].flat().filter((el) => el !== ""),
  );
  isDragging.value = null;
};
const handleDragStart = (index: number, event: MouseEvent) => {
  isLocked.value = true;
  if (props.settings.submittionMethods[index] !== "") {
    changeIndex.value = index;
    const cleanup = useEventListener(window, "pointerup", () =>
      handleDragEnd(),
    );
    cleanupfunc.value = cleanup;
    const currentOffset = event.offsetY;
    offset.value = currentOffset;
    const copyArray = [...props.settings.submittionMethods];
    // @ts-ignore
    copyArray.splice(index, 1, [copyArray[index]]);
    emits("change", copyArray);
    isDragging.value = index;
  }
};
</script>
<template>
  <div
    ref="customSubmittionMethodsContainer"
    class="custom-submittion-methods-container"
  >
    <div
      v-for="(methodInput, index) in settings.submittionMethods"
      :key="index"
    >
      <div
        ref="hoveredElements"
        class="custom-submittion-methods-elements"
        :style="isDragging === index ? draggableStyle : {}"
      >
        <div
          :style="{
            cursor: isDragging ? 'grabbing' : 'grab',
          }"
          class="drag-icon-container"
          @pointerdown="(event) => handleDragStart(index, event)"
        >
          <SimpleIcon
            :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
            :source="DndHandler"
            size="20px"
          />
        </div>
        <SimpleInput
          ref="testRef"
          style="width: 90%"
          :captionHidden="true"
          placeholder="値を空白にすることはできません。"
          :value="Array.isArray(methodInput) ? methodInput[0] : methodInput"
          :autofocus="
            index === settings.submittionMethods.length - 1
              ? focusTrigger
              : false
          "
          @focusout="handleFocusout"
          @change="(newValue) => handleMethodChange(newValue, index)"
        />
        <SimpleIcon
          class="delete-icon"
          :source="DeleteCross"
          size="25px"
          clickable
          @click="handleMethodDelete(index)"
        />
      </div>
      <div
        v-if="Array.isArray(methodInput)"
        class="custom-submittion-methods-elements"
      >
        <div class="hovered-fill-element"></div>
      </div>
    </div>
    <div class="custom-submittion-methods-elements">
      <div
        v-show="props.settings.submittionMethods.length < 7"
        :style="{
          cursor: isDragging ? 'grabbing' : 'grab',
        }"
        class="drag-icon-container"
      >
        <SimpleIcon
          :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
          :source="DndHandler"
          size="20px"
        />
      </div>

      <SimpleInput
        v-show="props.settings.submittionMethods.length < 7"
        style="width: 90%"
        :captionHidden="true"
        placeholder="別の値を追加..."
        :value="newValue"
        @focusin="handleNewValueFieldFocus"
        @focusout="() => (focusTrigger = false)"
      />
      <SimpleIcon
        class="delete-icon"
        :source="DeleteCross"
        style="visibility: hidden"
        size="25px"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.custom-submittion-methods-container {
  user-select: none;
  -webkit-user-select: none;
  padding: var(--space-6) 0;
}
.custom-submittion-methods-elements {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hovered-fill-element {
  background: var(--hovered);
  border-radius: var(--border-radius-1);
  height: 70px;
  width: 100%;
}
.drag-icon-container {
  height: 20px;
}
.delete-icon {
  padding-right: var(--space-2);
}
</style>
