import Vue from "vue";
import Buefy from "buefy";
import App from "./App.vue";
import "leaflet/dist/leaflet.css";
import "buefy/dist/buefy.css";

Vue.use(Buefy);

Vue.config.productionTip = false;
new Vue({
  render: h => h(App)
}).$mount("#app");
