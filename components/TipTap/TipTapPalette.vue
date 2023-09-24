<script setup lang="ts">
import {
  SimpleModal,
  SimpleInput,
  SimpleSelector,
  SimpleIcon,
} from "@materials";
import { TextColor, LinkChain, LinkUnChain } from "@materials/icons";
import { Editor } from "@tiptap/vue-3";
import TipTapColorPicker from "./TipTapColorPicker.vue";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: null,
  },
  open: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits<{
  (e: "enter"): void;
  (e: "leave"): void;
  (e: "heading"): void;
  (e: "subHeading"): void;
  (e: "paragraph"): void;
  (e: "change:color", color: string): void;
  (e: "color:unset"): void;
  (e: "link", url: string | null, target: "_blank" | "_self"): void;
  (e: "unlink"): void;
}>();
const handleMouseenter = () => {
  emits("enter");
};
const handleMouseleave = () => {
  emits("leave");
};
const handleHeading = () => {
  emits("heading");
};
const handleSubHeading = () => {
  emits("subHeading");
};
const handleParagraph = () => {
  emits("paragraph");
};
const colorPickerEntered = ref(false);
let colorPickerHoverTimerId: any = null;
const handleColorPickerMouseenter = () => {
  if (colorPickerHoverTimerId) {
    clearTimeout(colorPickerHoverTimerId);
  }
  colorPickerEntered.value = true;
};
const handleColorPickerMouseleave = () => {
  colorPickerHoverTimerId = setTimeout(() => {
    colorPickerEntered.value = false;
  }, 400);
};
const handleColorSelect = (color: string) => {
  emits("change:color", color);
};
const handleColorUnset = () => {
  emits("color:unset");
};
const urlTarget = ref<"_blank" | "_self">("_blank");
const urlTargets = [
  {
    label: "別のタブで開く",
    value: "_blank",
  },
  {
    label: "同じタブで開く",
    value: "_self",
  },
];
const handleUrlTargetChange = (newValue: "_blank" | "_self") => {
  urlTarget.value = newValue;
};
const urlModalOpen = ref(false);
const urlInput = ref("");
const handleUrlInputChange = (newValue: string) => {
  urlInput.value = newValue;
};
const handleUrlModalOpen = () => {
  const target = props.editor?.getAttributes("link").target;
  if (target) urlTarget.value = target;
  const url = props.editor?.getAttributes("link").href;
  if (url) urlInput.value = url;
  urlModalOpen.value = !urlModalOpen.value;
};
const handleUrlModalDestroy = () => {
  urlModalOpen.value = false;
};
const handleLink = () => {
  const url = urlInput.value;
  const target = urlTarget.value;
  handleUrlModalDestroy();
  emits("link", url, target);
};
const handleUnlink = () => {
  emits("unlink");
};
</script>
<template>
  <div>
    <transition>
      <div
        v-show="open"
        class="tiptap-editor-palette"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
        @click.prevent
      >
        <span
          class="tiptap-editor-palette__actions"
          :class="{
            'tiptap-editor-palette__is-active': editor?.isActive('heading', {
              level: 1,
            }),
          }"
          @click="handleHeading"
        >
          見出し
        </span>
        <span
          class="tiptap-editor-palette__actions"
          :class="{
            'tiptap-editor-palette__is-active': editor?.isActive('heading', {
              level: 3,
            }),
          }"
          @click="handleSubHeading"
        >
          小見出し
        </span>
        <span
          class="tiptap-editor-palette__actions"
          :class="{
            'tiptap-editor-palette__is-active': editor?.isActive('paragraph'),
          }"
          @click="handleParagraph"
        >
          本文
        </span>
        <div
          ref="colorPaletteActivator"
          class="tiptap-editor-palette__actions"
          style="display: inline-block"
          @click="handleUnlink"
          @mouseenter="handleColorPickerMouseenter"
          @mouseleave="handleColorPickerMouseleave"
        >
          <SimpleIcon
            class="tiptap-editor-palette__action-icons"
            :source="TextColor"
            size="18px"
            clickable
          />
          <TipTapColorPicker
            :editor="editor"
            :open="colorPickerEntered"
            @change:color="handleColorSelect"
            @color:unset="handleColorUnset"
          />
        </div>

        <span
          title="リンクを挿入"
          class="tiptap-editor-palette__actions"
          @click="handleUrlModalOpen"
        >
          <SimpleIcon
            class="tiptap-editor-palette__action-icons"
            :source="LinkChain"
            size="18px"
            clickable
          />
        </span>
        <span
          title="リンク解除"
          class="tiptap-editor-palette__actions"
          @click="handleUnlink"
        >
          <SimpleIcon
            class="tiptap-editor-palette__action-icons"
            :source="LinkUnChain"
            size="18px"
            clickable
          />
        </span>
      </div>
    </transition>
    <SimpleModal
      :open="urlModalOpen"
      title="リンクを挿入"
      :mainAction="{
        text: '挿入',
        onAction: handleLink,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: handleUrlModalDestroy,
      }"
      @destroy="handleUrlModalDestroy"
      @mainAction="handleLink"
      @subAction="handleUrlModalDestroy"
    >
      <div class="tiptap-editor-palette__url-modal-content">
        <SimpleInput
          class="tiptap-editor-palette__url-input"
          caption="URL"
          placeholder="https://"
          :value="urlInput"
          @change="handleUrlInputChange"
        />
        <SimpleSelector
          :value="urlTarget"
          :items="urlTargets"
          caption="リンクの開き方"
          @change="handleUrlTargetChange"
        />
      </div>
    </SimpleModal>
  </div>
</template>
<style scoped lang="scss">
.tiptap-editor-palette {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  height: 30px;
  width: 90%;
  border-radius: var(--border-radius-05);
  box-shadow: var(--box-shadow-1);
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  z-index: 10;
}
.tiptap-editor-palette__actions:hover {
  background: var(--hovered);
  border-radius: var(--border-radius-05);
}
.tiptap-editor-palette__actions {
  display: inline-block;
  line-height: 22px;
  padding: var(--space-1) var(--space-1);
  font-size: var(--font-size-3);
  cursor: pointer;
}
.tiptap-editor-palette__action-icons {
  padding-top: 2px;
}
.tiptap-editor-palette__is-active {
  background: var(--selected) !important;
  border-radius: var(--border-radius-05);
  color: var(--surface) !important;
}
.tiptap-editor-palette__url-modal-content {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.tiptap-editor-palette__url-input {
  width: 100%;
  flex-basis: 190%;
  margin-right: var(--space-2);
}
.v-enter {
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
.v-enter-active {
  transition: all 0.2s ease-in-out;
}
.v-leave {
  opacity: 1;
}
.v-leave-to {
  opacity: 0;
}
.v-leave-active {
  transition: all 500ms;
}
</style>
