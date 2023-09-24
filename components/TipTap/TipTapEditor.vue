<script setup lang="ts">
import { useFocusBackdrop } from "@materials";
import { Editor, EditorContent } from "@tiptap/vue-3";
import BasicSettings from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

import TipTapPalette from "./TipTapPalette.vue";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  initialValue: {
    type: String,
    default: undefined,
    required: false,
  },
  caption: {
    type: String,
    default: undefined,
    required: false,
  },
  placeholder: {
    type: String,
    default: "",
    required: false,
  },
});
const emits = defineEmits<{
  (e: "change:editor", html: string): void;
}>();
const mouseHovered = ref(false);
const handleMouseenter = () => {
  mouseHovered.value = true;
};
const handleMouseleave = () => {
  mouseHovered.value = false;
};
const editorFocus = ref(false);
const editor = ref<any>(null);
const { outputStyles, focusinFn, focusoutFn } = useFocusBackdrop();
onMounted(() => {
  editor.value = new Editor({
    content: props.initialValue,
    extensions: [
      BasicSettings,
      Link,
      Placeholder.configure({
        placeholder: props.placeholder,
      }),
      Color,
      TextStyle,
    ],
    onUpdate: () => {
      if (editor.value !== null) {
        emits("change:editor", editor.value.getHTML());
      }
    },
    onFocus: () => {
      editorFocus.value = true;
      focusinFn();
    },
    onBlur: () => {
      if (mouseHovered.value && editor.value) {
        editor.value.view.dom.focus();
      } else {
        editorFocus.value = false;
        focusoutFn();
      }
    },
  });
});
const { value } = toRefs(props);
watch(value!, () => {
  if (editor.value !== null) {
    const isSame = editor.value.getHTML() === props.value;
    if (isSame) {
      return;
    }
    editor.value.commands.setContent(props.value ? props.value : null, false);
  }
});
onBeforeUnmount(() => {
  editor.value!.destroy();
});
const handleHeadingToggle = () => {
  editor.value?.chain().focus().toggleHeading({ level: 1 }).run();
};
const handleSubHeadingToggle = () => {
  editor.value?.chain().focus().toggleHeading({ level: 3 }).run();
};
const handleParagraphToggle = () => {
  editor.value?.chain().focus().setParagraph().run();
};
const handleSetLink = (url: string | null, target: "_blank" | "_self") => {
  if (url === null) {
    return;
  }
  if (url === "") {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.value
    ?.chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url, target })
    .run();
};
const handleUnsetLink = () => {
  editor.value?.chain().focus().unsetLink().run();
};
const handleColorSelect = (color: string) => {
  editor.value?.chain().focus().setColor(color).run();
};
const handleColorUnset = () => {
  editor.value?.chain().focus().unsetColor().run();
};
</script>
<template>
  <div>
    <span class="tiptap-editor-caption">{{ caption }}</span>
    <div class="tiptap-editor-container">
      <div class="tiptap-editor-focused-border-backdrop"></div>
      <TipTapPalette
        :editor="editor"
        :open="editorFocus"
        @enter="handleMouseenter"
        @leave="handleMouseleave"
        @heading="handleHeadingToggle"
        @subHeading="handleSubHeadingToggle"
        @paragraph="handleParagraphToggle"
        @link="handleSetLink"
        @unlink="handleUnsetLink"
        @change:color="handleColorSelect"
        @color:unset="handleColorUnset"
      />
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>
<style lang="scss">
.tiptap-editor-container {
  position: relative;
  text-align: left;
  .tiptap-editor-caption {
    font-size: var(--font-size-3);
    pointer-events: none;
    padding: 0 var(--space-1);
  }
}
.ProseMirror {
  font-family: Helvetica, Arial, sans-serif;
  border-radius: var(--border-radius-1);
  background: var(--surface);
  padding-top: 0;
  padding-left: var(--space-3);
  padding-right: var(--space-3);
  padding-bottom: var(--space-10);
  border: 1px solid var(--border-weak);
  transition: border 0.5s;
  min-height: 120px;
  p {
    line-height: 1.7;
    cursor: pointer;
    pointer-events: none;
  }
  h1 {
    font-size: var(--font-size-8);
    line-height: 1.1;
  }
  h3 {
    font-size: var(--font-size-6);
    line-height: 1.1;
  }
  a {
    color: #68cef8;
  }
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
.ProseMirror:focus {
  outline: 0;
}
.tiptap-editor-focused-border-backdrop {
  position: absolute;
  width: calc(100% + 1px);
  height: calc(100% + 1px);
  border-radius: var(--border-radius-1);
  box-shadow: 0 0 0 v-bind(outputStyles) var(--theme-color);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
