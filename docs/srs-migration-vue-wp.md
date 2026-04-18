# SRS: Migración Funcional Vue.js 3 → WordPress Native

**Proyecto:** `plantilla-www` (DataMaq)
**Estrategia Recomendada:** Tema Clásico Híbrido (PHP Templates + Alpine/Vue enbebido)
**Prioridad:** Fidelidad visual pixel-perfect y soberanía sobre el código.

---

## 1. Alcance y Contexto
Este documento especifica los requisitos para migrar el frontend SPA (Vue 3/Vite/Tailwind v4) a una arquitectura nativa de WordPress en el VPS de producción. Se busca eliminar la dependencia de un servidor de Node.js en tiempo de ejecución, delegando el renderizado al motor de PHP de WordPress, manteniendo el Design System de Tailwind v4.

### 1.1 Límites de la Migración
- **In-Scope**: Layout completo, Design System (tokens CSS), SEO dinámico, y formularios de contacto.
- **Out-of-Scope**: Rediseño visual (se mantiene paridad 1:1 con `localhost:5173`).

---

## 2. Requerimientos Funcionales (RF)

### RF-1: Gestión de Variantes de Página (Home)
- El tema debe soportar las variantes `direct` y `authority` mediante parámetros de URL o configuración de página en WP, replicando la lógica de `resolveHomeVariant()` detectada en Vue.

### RF-2: Mapeo de Componentes UI
Cada sección de Vue se mapeará a un `template-part` de PHP:
- **RF-2.1 [Hero Section]**: Debe soportar el renderizado dinámico de la imagen de fondo (con gradiente CSS) y las "Trust Signals" basadas en los metadatos de la página.
- **RF-2.2 [Profile Section]**: Mapeo de campos para el técnico a cargo (nombre, rol, foto) y la lista de beneficios con iconos de Bootstrap Icons.
- **RF-2.3 [Services Grid]**: Renderizado de tarjetas de servicios basado en un `Custom Post Type` o un bloque repetible de ACF/Custom Metadata.
- **RF-2.4 [FAQ Accordion]**: Implementación de acordeón accesible (A11y) con soporte para Schema.org FAQPage.
- **RF-2.5 [WhatsApp FAB & Dock]**: Floating Action Button y barra de navegación inferior (Dock) persistente en mobile.

### RF-3: Flujo de Contacto
- El formulario de contacto debe enviarse vía `POST` a `admin-post.php` para procesamiento nativo en WP, con redirección posterior a `/gracias/`.
- Debe integrarse validación Anti-Bot vía Cloudflare Turnstile.

---

## 3. Requerimientos No Funcionales (RNF)

- **RNF-1 [Performance]**: Tiempo de carga inicial (LCP) < 1.5s. El uso de PHP nativo debe mejorar el TTFB al eliminar la hidratación de la SPA.
- **RNF-2 [Style Parity]**: Uso obligatorio de Tailwind CSS v4 para la generación de estilos, asegurando que las clases consumidas en PHP sean compiladas en el bundle final del tema.
- **RNF-3 [Soberanía Técnica]**: Prohibido el uso de "Page Builders" (Elementor, Divi) o abstracciones opacas. El layout se define en código (.php).
- **RNF-4 [SEO Parity]**: Mantenimiento de Canonicals, Robots (noindex en thanks), y Open Graph sin dependencias de plugins pesados.

---

## 4. Arquitectura de Solución
Se propone una estructura de **Tema Clásico** organizada por módulos:
- `header.php` / `footer.php`: Inyección de assets compilados (Vite) y tracking.
- `template-parts/home/`: Fragmentos PHP para cada sección Vue (Hero, Services, etc.).
- `inc/setup.php`: Configuración de soportes del tema y limpieza de scripts sobrantes de WP.
- `inc/assets.php`: Encolado de CSS/JS con versionado para romper caché.

### Estrategia de Build
Se utilizará Vite en modo `build` para procesar los estilos de Tailwind v4, escaneando los archivos `.php` del tema para generar el CSS optimizado.

---

## 5. Matriz de Trazabilidad

| Componente Vue (Origen) | Elemento WP (Destino) | Hook / Mecanismo |
|---|---|---|
| `HomePage.vue` | `front-page.php` | Template jerárquico |
| `ContactFormSection.vue`| `template-parts/contact-form.php` | `admin_post_nopriv_contact` |
| `AppSeo.ts` | `inc/seo.php` | `wp_head` |
| `ConsentBanner.vue` | `template-parts/consent-banner.php` | PHP + Vanilla JS |
| `siteSnapshot.datamaq.ts`| `wp_options` / ACF | Repositorio de datos |

---

## 6. Riesgos Técnicos y Mitigaciones

- **Riesgo**: Pérdida de interactividad fluida en el Cotizador.
- **Mitigación**: Embeber el build de Vue del Cotizador como un "Micro-frontend" aislado solo en la página correspondiente, o simplificar a Alpine.js.
- **Riesgo**: Desincronización de estilos entre Vue (Dev) y WP (Prod).
- **Mitigación**: Usar el mismo archivo de configuración de Tailwind v4 y ejecutar el build de producción apuntando a los templates PHP.

---

## 7. Plan de Validación
1. **Validación Visual**: Comparativa via Playwright entre `localhost:5173` y el entorno de Staging en WP.
2. **Validación Funcional**: Test de envío de leads con Turnstile activo.
3. **Validación SEO**: Auditoría con Screaming Frog para verificar Canonicals y Robots vs el inventario de la Fase 0.
