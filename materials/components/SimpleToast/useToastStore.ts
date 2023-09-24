import { reactive, InjectionKey } from "vue";

export default function useToastTimerStore() {
  type TimerKeyArray = NodeJS.Timeout[];
  const state = reactive<{ timerKeyArray: TimerKeyArray }>({
    timerKeyArray: [],
  });
  return {
    get timerKeyArray() {
      return state.timerKeyArray;
    },
    setTimerKey(timerKey: NodeJS.Timeout) {
      state.timerKeyArray.push(timerKey);
    },
    resetTimerKey(timerKey: NodeJS.Timeout | null) {
      if (timerKey !== null) {
        state.timerKeyArray.splice(state.timerKeyArray.indexOf(timerKey), 1);
      }
    },
  };
}
export type ToastTimerStore = ReturnType<typeof useToastTimerStore>;
export const ToastTimerKey: InjectionKey<ToastTimerStore> =
  Symbol("ToastTimerStore");
