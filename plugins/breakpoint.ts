import { useBreakpoints } from "@vueuse/core";

interface BreakpointsPlugin {
  $breakpoints: ReturnType<
    typeof useBreakpoints<"sm" | "md" | "lg" | "xl" | "2xl">
  >;
  $isMobile: Ref<boolean>;
}

declare module "nuxt/dist/app/nuxt" {
  interface NuxtApp extends BreakpointsPlugin {}
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties extends BreakpointsPlugin {}
}

export default defineNuxtPlugin(() => {
  const breakpoints = useBreakpoints({
    sm: 400,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  });
  const isMobile = breakpoints.smaller("lg");
  return {
    provide: {
      breakpoints,
      isMobile,
    },
  };
});
