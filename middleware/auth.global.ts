import { signInWithCustomToken } from "firebase/auth";

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
        if (nuxt.$auth && result.token) {
          await signInWithCustomToken(nuxt.$auth, result.token);
        }
      }
    } catch (e) {
      const params = new URLSearchParams();
      params.set("redirect", window.location.href);
      if (config.public.NODE_ENV === "production") {
        navigateTo(
          `${
            config.public.AUTH_SITE_BASE_URL
          }/auth0/login?${params.toString()}`,
          {
            external: true,
          },
        );
      }
    }
  }
});
