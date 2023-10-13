import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
} from "firebase/auth";

export default defineNuxtRouteMiddleware(async () => {
  const nuxt = useNuxtApp();
  const config = useRuntimeConfig();
  if (!nuxt.$user.value) {
    try {
      const response = await fetch(
        `${config.public.AUTH_SITE_BASE_URL}/api/auth/status`,
        {
          mode: "cors",
          credentials: "include",
        },
      );
      if (response.ok) {
        const result = await response.json();
        if (result.status === "re-login") {
          throw new Error("re-login required");
        }
        if (nuxt.$auth && result.token) {
          await signInWithCustomToken(nuxt.$auth, result.token);
        }
      }
    } catch (e) {
      const params = new URLSearchParams();
      params.set("redirect", window.location.href);
      switch (config.public.VERCEL_ENV) {
        case "production":
          navigateTo(
            `${
              config.public.AUTH_SITE_BASE_URL
            }/auth/login?${params.toString()}`,
            {
              external: true,
            },
          );
          break;
        case "development": {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(nuxt.$auth, provider);
          break;
        }
        default:
          break;
      }
    }
  }
});
