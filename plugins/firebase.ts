import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  Auth,
  User,
} from "firebase/auth";

interface FirebaseInjections {
  $app: FirebaseApp;
  $auth: Auth;
  $user: Ref<User | null>;
  $updateUser: (user: User | null) => void;
}

declare module "nuxt/dist/app/nuxt" {
  interface NuxtApp extends FirebaseInjections {}
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties extends FirebaseInjections {}
}

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseApp = initializeApp(
    JSON.parse(nuxtApp.$config.public.FIREBASE_PROJECT),
  );
  const auth = getAuth(firebaseApp);
  //   setPersistence(auth, browserSessionPersistence);
  const user = ref<User | null>(null);
  const updateUser = (newUser: User | null) => {
    user.value = newUser;
  };
  return {
    provide: {
      app: firebaseApp,
      auth,
      user,
      updateUser,
    },
  };
});
