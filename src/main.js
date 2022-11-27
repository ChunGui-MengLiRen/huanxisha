import { createApp } from "vue";
import naive from "naive-ui";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "./style.css";

const app = createApp(App);

app.use(naive);
app.use(createPinia());
app.use(router);
app.mount("#app");
