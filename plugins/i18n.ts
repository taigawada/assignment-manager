import { messages } from "@/components/student/i18n/messages";
import { createI18n } from "vue-i18n";

type Grades =
  | "grade1"
  | "grade2"
  | "grade3"
  | "grade4"
  | "grade5"
  | "grade6"
  | "grade7"
  | "all";

interface I18nInjectons {
  $grade: Ref<Grades>;
  $changeGrade: (grade: Grades) => void;
}

declare module "nuxt/dist/app/nuxt" {
  interface NuxtApp extends I18nInjectons {}
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties extends I18nInjectons {}
}

export default defineNuxtPlugin(({ vueApp }) => {
  const grade = ref<Grades>("all");
  const i18nInstaller = createI18n({
    legacy: false,
    globalInjection: true,
    locale: grade.value,
    messages,
  });
  const changeGrade = (newGrade: Grades) => {
    grade.value = newGrade;
    i18nInstaller.global.locale.value = newGrade;
  };

  vueApp.use(i18nInstaller);
  return {
    provide: {
      grade,
      changeGrade,
    },
  };
});
