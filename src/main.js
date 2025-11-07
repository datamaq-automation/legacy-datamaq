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

clarity.init(import.meta.env.VITE_CLARITY_PROJECT_ID);

createApp(App).mount('#app')
