# profebustos-www

Proyecto web basado en **Vue 3** y **Vite** para el sitio de Profebustos.

## Características

- SPA con Vue 3 + Vite
- Componentes reutilizables (Navbar, Hero, Servicios, WhatsApp, Footer, etc.)
- Registro de conversiones vía API (WhatsApp click)
- Formulario de contacto por correo con fallback `mailto:`
- Fácil configuración y despliegue

## Requisitos

- Node.js >= 20.19.0
- npm >= 8
- Servidor PHP para el backend de la API
- MySQL/MariaDB para persistencia de conversiones

## Instalación y uso

1. **Instalar dependencias:**
   ```sh
   npm install
   ```

2. **Desarrollo con recarga automática:**
   ```sh
   npm run dev
   ```

3. **Compilar para producción:**
   ```sh
   npm run build
   ```

## Configuración recomendada del IDE

- [VS Code](https://code.visualstudio.com/)
- Extensión [Vue (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desactiva Vetur)

## Herramientas recomendadas para navegador

- **Chrome/Edge/Brave:**  
  [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)  
  [Custom Object Formatter](http://bit.ly/object-formatters)
- **Firefox:**  
  [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)  
  [Custom Object Formatter](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## API de conversión

El frontend registra conversiones (clic en WhatsApp) mediante una API REST en PHP.
Consulta la [documentación de la API](./docs/API_documentation.md) para detalles de uso y respuesta.

Para el nuevo canal de correo electrónico se espera un backend dedicado; el contrato sugerido está en [docs/API-document.md](./docs/API-document.md).

## Personalización

- Configurá las variables en `.env` (`VITE_WHATSAPP_NUMBER`, `VITE_CHAT_URL`, `VITE_CONTACT_EMAIL`, etc.).
- Personaliza los componentes en `src/components/`

## Referencias

- [Vite Configuration Reference](https://vite.dev/config/)
- [Vue.js Documentation](https://vuejs.org/)

---

¿Dudas o sugerencias?  
Contacta a [Profebustos](mailto:contacto@profebustos.com.ar)
