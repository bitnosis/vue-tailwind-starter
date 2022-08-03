import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "dtoaster/dist/dtoaster.css";
import DToaster from "dtoaster";
import ToasterPresets from ".//assets/toasterPresets.json";

Vue.use(VueCompositionAPI);
Vue.use(require("vue-faker"));
Vue.use(DToaster, {
  presets: ToasterPresets,
  position: "bottom-right",
  containerOffset: "45px"
});

Vue.config.productionTip = process.env.NODE_ENV === "development";

new Vue({
  name: "App",
  store,
  router,
  render: h => h(App)
}).$mount("#app");
