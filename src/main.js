/*
Path: src/main.js
*/

import { createApp } from 'vue'
import App from './App.vue'
// Importar Bootstrap CSS y JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import clarity from "@microsoft/clarity";
import VueGtag from "vue-gtag-next";

clarity.init(import.meta.env.VITE_CLARITY_PROJECT_ID);

const app = createApp(App);

app.use(VueGtag, {
  property: {
    id: import.meta.env.VITE_GA4_ID
  }
});

app.mount('#app')
