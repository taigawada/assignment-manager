import { resolve } from "path";
import svgLoader from "vite-svg-loader";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    "@materials/icons": resolve(__dirname, "./materials/icons.index.ts"),
    "@materials": resolve(__dirname, "./materials/components.index.ts"),
    "@": resolve(__dirname),
  },
  ssr: false,
  // serverHandlers: [
  //   {
  //     route: "/api/**",
  //     handler: "~/server/index.ts",
  //   },
  // ],
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  runtimeConfig: {
    public: {
      NODE_ENV: process.env.NODE_ENV,
      FIREBASE_PROJECT: process.env.FIREBASE_PROJECT,
      AUTH_SITE_BASE_URL: process.env.AUTH_SITE_BASE_URL,
    },
  },
  vite: {
    plugins: [svgLoader()],
  },
});
