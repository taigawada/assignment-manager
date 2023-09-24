import { InjectionKey } from "vue";
import { usePreferredDark } from "@vueuse/core";
import general from "./theme/assets/general.json";
import light from "./theme/assets/light.json";
import dark from "./theme/assets/dark.json";

import useToastTimerStore, {
  ToastTimerKey,
} from "../components/SimpleToast/useToastStore";

interface Theme {
  [key: string]: { [key: string]: string };
}

export const switchThemeKey = Symbol("switchTheme") as InjectionKey<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (theme: string) => void
>;
const install = (app: any, option: Theme = {}) => {
  if (document) {
    Object.keys(general).forEach((key: string) => {
      // @ts-ignore
      document.documentElement.style.setProperty(key, general[key]);
    });
  }
  const themes: Theme = { light, dark };
  Object.keys(option).forEach((theme: string) => {
    if (theme === "light" || theme === "dark") {
      Object.assign(themes[theme], option[theme]);
    } else {
      Object.assign(themes, { [theme]: option[theme] });
    }
  });
  const switchTheme = (theme: string) => {
    if (themes[theme] && document) {
      Object.keys(themes[theme]).forEach((key: string) => {
        document.documentElement.style.setProperty(key, themes[theme][key]);
      });
    }
  };
  const isDark = usePreferredDark();
  switchTheme(isDark.value ? "dark" : "light");
  if (isVue2) {
    // eslint-disable-next-line no-param-reassign
    app.prototype.$switchTheme = switchTheme;
    // eslint-disable-next-line no-param-reassign
    app.prototype.$toastStore = useToastTimerStore();
  } else {
    app.provide(switchThemeKey, switchTheme);
    app.provide(ToastTimerKey, useToastTimerStore());
  }
};
export default { install };
