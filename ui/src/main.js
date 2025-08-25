import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import axios from "axios";
import "./assets/css/style.scss";

loadFonts();
// Place in main.js or App.vue before mounting Vue app
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class extends _ResizeObserver {
  constructor(cb) {
    const debounce = (fn, ms) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
      };
    };
    super(debounce(cb, 20));
  }
};
// Optionally set a base URL for axios (adjust if your backend runs on different port)
axios.defaults.baseURL = "http://localhost:5000";

const app = createApp(App);

app.config.globalProperties.$axios = axios; // Make axios available globally as $axios if you want

app.use(router).use(vuetify).mount("#app");
