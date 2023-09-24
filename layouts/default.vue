<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

import Header from "./default/header.vue";
import Nav from "./default/nav.vue";

const nuxt = useNuxtApp();
const sidebarOpen = ref(false);
const handleSidebarOpenToggle = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
watch([nuxt.$isMobile], () => {
  sidebarOpen.value = false;
});
const onClickOutside = () => {
  sidebarOpen.value = false;
};
const onTransition = () => {
  sidebarOpen.value = false;
};
const handleLogout = async () => {};
</script>
<template>
  <div class="container">
    <div class="header-content" ref="headerEl">
      <Header
        :sidebar="$isMobile.value"
        @toggleOpen="handleSidebarOpenToggle"
        @logout="handleLogout"
      ></Header>
    </div>
    <div class="main">
      <div v-if="!$isMobile.value" class="nav">
        <Nav @logout="handleLogout"></Nav>
      </div>
      <div v-else v-show="sidebarOpen">
        <div
          class="nav-mobile-background"
          @click="onClickOutside"
          @keydown.esc="onClickOutside"
        ></div>
        <div class="nav-mobile-content">
          <Nav @transition="onTransition" @logout="handleLogout"></Nav>
        </div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
    <!-- <div class="footer">
      <p>FOOTER</p>
    </div> -->
  </div>
</template>
<style lang="scss" scoped>
@use "@/scss/breakpoints";
@use "@/scss/mixin";

.container {
  display: flex;
  flex-flow: column;
}
.header-content {
  grid-area: header-content;
  background: rgb(255, 255, 255);
  box-shadow: rgba(31, 33, 36, 0.1) 0px 1px 1px 0px;
}
.main {
  position: relative;
  // height: calc(100vh - v-bind(heightPx));
  height: auto;
  display: grid;
  grid-template-columns: 1fr;
  @include mixin.mq(lg) {
    grid-template-columns: 1fr 5fr;
  }
}
.nav {
  min-width: 200px;
  border-right: 1px solid rgb(225, 227, 229);
}
.nav-mobile-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: rgba(44, 44, 44, 0.8);
  z-index: 998;
}
.nav-mobile-content {
  background: var(--global-background);
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  min-height: 100vh;
  height: 100%;
  @include mixin.mq(md) {
    width: 40%;
  }
  z-index: 999;
}
.footer {
  background: rgb(225, 225, 225);
}
</style>
