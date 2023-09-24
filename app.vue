<script setup lang="ts">
import AuthLoading from "@/components/AuthLoading.vue";
import { useNuxtApp } from "nuxt/app";
import { SimpleComponents, SimpleToast } from "@materials";
import { onAuthStateChanged } from "firebase/auth";
import { holidayKey } from "@/types/injectionKeys";

const nuxt = useNuxtApp();
nuxt.vueApp.use(SimpleComponents);

const unsubscribe = onAuthStateChanged(nuxt.$auth, async (newUser) => {
  nuxt.$updateUser(newUser);
});
onBeforeUnmount(() => {
  unsubscribe();
});
const response = await $fetch<{ [date: string]: string }>(
  "https://holidays-jp.github.io/api/v1/date.json",
);
provide(
  holidayKey,
  Object.keys(response).map((k) => ({ date: new Date(k), name: response[k] })),
);
</script>
<template>
  <NuxtLayout>
    <div>
      <NuxtLoadingIndicator />
      <SimpleToast
        v-for="toast in nuxt.$toasts.value"
        :key="toast.key"
        :active="toast.active"
        :content="toast.content"
        :action="toast.action"
        :error="toast.isError"
        :duration="toast.duration"
        @dismiss="$dismissToast(toast)"
      />
      <NuxtPage v-if="nuxt.$user.value" />
      <AuthLoading v-else />
    </div>
  </NuxtLayout>
</template>
<style lang="scss">
*,
*:before,
*:after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
html {
  background-color: var(--global-background);
}
body {
  box-sizing: border-box;
  margin: 0;
  font-family: "ヒラギノ角ゴ ProN", Helvetica, Arial, sans-serif;
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222222;
}
</style>
