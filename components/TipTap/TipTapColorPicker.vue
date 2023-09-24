<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";

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
  (e: "change:color", color: string): void;
  (e: "color:unset"): void;
}>();
const handleColorSelect = (color: string) => {
  emits("change:color", color);
};
const handleColorUnset = () => {
  emits("color:unset");
};
</script>
<template>
  <div v-show="open" class="tiptap-editor-color-picker-float-box">
    <div
      class="tiptap-editor-color-picker-sample red"
      :class="{
        'tiptap-editor-color-picker-sample-is-active': editor?.isActive(
          'textStyle',
          { color: '#ff2600' },
        ),
      }"
      @click.stop="handleColorSelect('#ff2600')"
    ></div>
    <div
      class="tiptap-editor-color-picker-sample blue"
      :class="{
        'tiptap-editor-color-picker-sample-is-active': editor?.isActive(
          'textStyle',
          { color: '#0056d6' },
        ),
      }"
      @click.stop="handleColorSelect('#0056d6')"
    ></div>
    <div
      class="tiptap-editor-color-picker-sample pink"
      :class="{
        'tiptap-editor-color-picker-sample-is-active': editor?.isActive(
          'textStyle',
          { color: '#ff40ff' },
        ),
      }"
      @click.stop="handleColorSelect('#ff40ff')"
    ></div>
    <div
      class="tiptap-editor-color-picker-sample purple"
      :class="{
        'tiptap-editor-color-picker-sample-is-active': editor?.isActive(
          'textStyle',
          { color: '#7b219f' },
        ),
      }"
      @click.stop="handleColorSelect('#7b219f')"
    ></div>
    <div
      class="tiptap-editor-color-picker-sample orange"
      :class="{
        'tiptap-editor-color-picker-sample-is-active': editor?.isActive(
          'textStyle',
          { color: '#ff6a00' },
        ),
      }"
      @click.stop="handleColorSelect('#ff6a00')"
    ></div>
    <div
      class="tiptap-editor-color-picker-sample unset"
      :class="{
        'tiptap-editor-color-picker-sample-is-active': editor?.isActive(
          'textStyle',
          { color: '#ff6a00' },
        ),
      }"
      @click.stop="handleColorUnset()"
    ></div>
  </div>
</template>
<style scoped lang="scss">
.tiptap-editor-color-picker-float-box {
  position: absolute;
  display: inline-flex;
  padding: var(--space-2);
  border-radius: var(--border-radius-1);
  background: var(--surface);
  margin-top: 35px;
  transform: translate(calc(-9px - 50%));
  box-shadow: var(--box-shadow-1);
  cursor: auto;
}
.tiptap-editor-color-picker-float-box::before {
  content: "";
  border: 5px solid transparent;
  border-bottom: 5px solid var(--surface);
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
}
.tiptap-editor-color-picker-sample {
  width: 24px;
  height: 24px;
  margin: var(--space-1) var(--space-1);
  border-radius: 50%;
  cursor: pointer;
}
.tiptap-editor-color-picker-sample-is-active {
  border: 2px solid var(--selected);
}
.red {
  background: #ff2600;
  box-shadow:
    inset 20px 20px 60px #d92000,
    inset -20px -20px 60px #ff2c00;
}
.blue {
  background: #0056d6;
  box-shadow:
    inset 20px 20px 60px #0049b6,
    inset -20px -20px 60px #0063f6;
}
.pink {
  background: #ff40ff;
  box-shadow:
    inset 20px 20px 60px #d936d9,
    inset -20px -20px 60px #ff4aff;
}
.purple {
  background: #7b219f;
  box-shadow:
    inset 20px 20px 60px #691c87,
    inset -20px -20px 60px #8d26b7;
}
.orange {
  background: #ff6a00;
  box-shadow:
    inset 20px 20px 60px #d95a00,
    inset -20px -20px 60px #ff7a00;
}
.unset {
  border: 0.1px solid var(--surface-black);
  background: linear-gradient(
    45deg,
    #fff,
    #fff 49%,
    #ff2600 50%,
    #fff 51%,
    #fff
  );
}
</style>
