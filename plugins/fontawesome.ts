import { config, library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBars,
  faUser,
  faUpRightFromSquare,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default defineNuxtPlugin((nuxtApp) => {
  config.autoAddCss = false;
  library.add(faBars, faUser, faUpRightFromSquare, faArrowRightFromBracket);
  nuxtApp.vueApp.component("fa", FontAwesomeIcon);
});
