import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
interface AuthenticateFetchPlugin {
  $authenticatedFetch: typeof $fetch;
  $useAuthenticatedFetch: typeof useFetch;
}

declare module "nuxt/dist/app/nuxt" {
  interface NuxtApp extends AuthenticateFetchPlugin {}
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties extends AuthenticateFetchPlugin {}
}
type FetchParams = Parameters<typeof $fetch>;
type UseFetchParams = Parameters<typeof useFetch>;
export default defineNuxtPlugin(() => {
  const nuxt = useNuxtApp();
  const config = useRuntimeConfig();
  const loginInDevelopment = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(nuxt.$auth, provider);
  };
  return {
    provide: {
      async authenticatedFetch(
        request: FetchParams[0],
        option: FetchParams[1],
      ) {
        let user = nuxt.$user.value;
        if (!user) {
          if (config.public.NODE_ENV === "production") {
            throw new Error("Login Required.");
          } else {
            try {
              const provider = new GoogleAuthProvider();
              const result = await signInWithPopup(nuxt.$auth, provider);
              user = result.user;
            } catch (e) {
              nuxt.$showToast({ content: "ログインに失敗", isError: true });
            }
          }
        }
        if (!user) {
          throw new Error("Login Error");
        }
        const token = await user.getIdToken();
        return $fetch(request, {
          ...option,
          headers: {
            ...option?.headers,
            "X-USER-ID-TOKEN": token,
          },
        });
      },
      async useAuthenticatedFetch(
        uri: UseFetchParams[0],
        option?: UseFetchParams[1],
      ) {
        let user = nuxt.$user.value;
        if (!user) {
          if (config.public.NODE_ENV === "production") {
            throw new Error("Login Required.");
          } else {
            try {
              const provider = new GoogleAuthProvider();
              const result = await signInWithPopup(nuxt.$auth, provider);
              user = result.user;
            } catch (e) {
              nuxt.$showToast({ content: "ログインに失敗", isError: true });
            }
          }
        }
        if (!user) {
          throw new Error("Login Error");
        }
        const token = await user.getIdToken();
        return useFetch(uri as "/api/teacher", {
          ...option,
          headers: {
            ...option?.headers,
            "X-USER-ID-TOKEN": token,
          },
        });
      },
    },
  };
});
