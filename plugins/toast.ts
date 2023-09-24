interface ToastPlugin {
  $toasts: Ref<Toast[]>;
  $showToast: (toast: ToastContent) => void;
  $dismissToast: (toast: Toast) => Promise<void>;
}

declare module "nuxt/dist/app/nuxt" {
  interface NuxtApp extends ToastPlugin {}
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties extends ToastPlugin {}
}

interface ToastContent {
  content: string;
  action?: {
    label: string;
    onAction: () => void;
  };
  isError?: boolean;
}
interface Toast extends ToastContent {
  active: boolean;
  key: number;
  duration: number;
}

export default defineNuxtPlugin(() => {
  const toastArray = ref<Toast[]>([]);
  return {
    provide: {
      toasts: toastArray,
      showToast(toast: ToastContent) {
        const key = crypto.getRandomValues(new Uint32Array(1))[0];
        let duration = 3000;
        if (toast.isError) {
          duration = 5500;
        }
        toastArray.value = [
          ...toastArray.value,
          { key, active: false, duration, ...toast },
        ];
        nextTick(() => {
          const targetToast = toastArray.value.find(
            (target) => target.key === key,
          );
          if (targetToast) targetToast.active = true;
        });
      },
      async dismissToast(toast: Toast) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        toastArray.value = toastArray.value.filter(
          (toasts) => toasts.key !== toast.key,
        );
      },
    },
  };
});
