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
  return {
    provide: {
      async authenticatedFetch(
        request: FetchParams[0],
        option: FetchParams[1],
      ) {
        const user = nuxt.$user.value;
        if (!user) {
          throw new Error("Login Required.");
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
        const user = nuxt.$user.value;
        if (!user) {
          throw new Error("Login Required.");
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
