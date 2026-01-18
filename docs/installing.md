# Instalación del Proyecto

Este documento describe cómo preparar, ejecutar y desplegar el frontend desarrollado con Vue + Vite.

---

## 1. Requisitos

- Node.js >= 16
- npm >= 8

---

## 2. Configuración inicial

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tu-usuario/profebustos-www.git
   cd profebustos-www
   ```

2. Crea tu archivo de variables de entorno a partir del ejemplo provisto:
   ```sh
   cp example.env .env
   ```

3. Edita `.env` con los valores reales:
   - `VITE_WHATSAPP_NUMBER`: número de WhatsApp completo (sin signos ni espacios) utilizado por el botón de contacto.
   - `VITE_CLARITY_PROJECT_ID`: identificador del proyecto en Microsoft Clarity para el tracking de sesiones.
   - `VITE_GA4_ID`: identificador de la propiedad de Google Analytics 4.

---

## 3. Ejecución local

1. Instala las dependencias:
   ```sh
   npm install
   ```

2. Levanta el servidor de desarrollo:
   ```sh
   npm run dev
   ```

3. Genera el build de producción:
   ```sh
   npm run build
   ```

---

## 4. Analítica y trazabilidad

El sitio no depende de un backend propio para registrar conversiones. Los clics al canal de WhatsApp se registran mediante:

- **Google Analytics 4**: se emite el evento `whatsapp_click` con información sobre la sección de origen, la fuente de tráfico, la URL visitada y el tiempo de navegación previo al clic.
- **Microsoft Clarity**: se envía el mismo evento `whatsapp_click` para facilitar la segmentación de sesiones y la reproducción de interacciones clave.

Para garantizar la captura de datos, verifica que los IDs de GA4 y Clarity estén correctamente configurados en `.env` antes de construir o desplegar el sitio.

---

## 5. Despliegue

El build generado en `dist/` puede servirse desde cualquier hosting de archivos estáticos (Netlify, Vercel, Cloudflare Pages, etc.). Asegúrate de:

- Proveer las mismas variables de entorno (`VITE_*`) en el entorno de construcción remoto.
- Incluir los scripts externos de Clarity y GA4 provistos automáticamente por las dependencias al montar la aplicación.

Con esto, el sitio quedará listo para producción sin dependencias adicionales.

---

¿Dudas o problemas? Contacta a [Profebustos](mailto:contacto@profebustos.com.ar).
