import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import clarity from "@microsoft/clarity";
import VueGtag from "vue-gtag-next";

const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID;
console.log(`[Clarity] Inicializando Microsoft Clarity con ID: ${clarityId}`);

clarity.init(clarityId);

const app = createApp(App);

const ga4Id = import.meta.env.VITE_GA4_ID;
console.log(`[GA4] Inicializando Google Analytics con ID: ${ga4Id}`);

app.use(VueGtag, {
  config: {
    id: ga4Id
  },
  bootstrap(gtag: (...args: any[]) => void) {
    console.log(`[GA4] Google Analytics inicializado con ID: ${ga4Id}`);
    window.gtag = function (...args: any[]) {
      console.log("[GA4] Evento enviado:", args);
      gtag.apply(this, args);
    };
  }
});

app.mount('#app')