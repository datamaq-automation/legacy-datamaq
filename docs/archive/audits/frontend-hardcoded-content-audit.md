# Auditoria de contenido hardcodeado en frontend

Fecha: 2026-03-01

## Alcance

Este documento lista solo hallazgos verificados en el frontend sobre contenido textual o comercial embebido en codigo, con foco en una futura migracion al backend.

## Certezas

### 1. Existe un fallback completo de contenido local hardcodeado

El repositorio tiene un constructor de contenido local que arma un `AppContent` entero en frontend. Ese fallback incluye copy visible para:

- hero
- servicios
- about
- perfil
- navbar
- footer
- legal
- contacto
- consentimiento
- decision flow / FAQ
- vista de agradecimiento

Referencia: [landingContentBuilder.ts](../src/infrastructure/content/landingContentBuilder.ts#L7)

Implicacion: aunque haya backend de contenido, el frontend hoy conserva una version local completa lista para renderizarse cuando el remoto no esta disponible o no aplica.

### 2. El frontend ya esta preparado para consumir contenido remoto, pero parte del contenido sigue viviendo localmente

`ContentRepository` inicializa el store con `buildAppContent` y luego intenta aplicar contenido remoto y pricing remoto.

Referencias:

- [contentRepository.ts](../src/infrastructure/content/contentRepository.ts#L57)
- [dynamicContentService.ts](../src/infrastructure/content/dynamicContentService.ts#L45)

Implicacion: no todo lo hardcodeado esta "activo" todo el tiempo, pero si es contenido productivo de fallback y por eso forma parte real del comportamiento actual.

### 3. `HomePage.vue` mezcla contenido remoto/store con copy literal en la propia vista

Hay varios textos visibles al usuario que no salen de `AppContent`, sino de strings embebidos en la vista:

- `Contacto` en el CTA de header.
- `Iniciar contacto` como fallback del CTA principal.
- `Cobertura tecnica activa`.
- `Senales de confianza`.
- `Perfil profesional`.
- nombre fijo `Agustin Bustos`.
- `Contacto directo por WhatsApp`.
- `Ir al formulario`.
- `Enfoque tecnico`.
- `Servicios`.
- `Soluciones tecnicas orientadas a planta, mantenimiento y mejora continua.`
- `Ayuda`.
- `Preguntas frecuentes`.

Referencia: [HomePage.vue](../src/ui/pages/HomePage.vue#L73)

Implicacion: aunque `hero`, `services`, `about`, `profile`, `legal` y `faqItems` vengan del repositorio de contenido, la homepage no esta totalmente desacoplada del frontend.

### 4. La navegacion rapida y algunos labels de navegacion son hardcodeados en `HomePage.ts`

Hay texto funcional embebido en la logica de la pagina:

- `Explorar servicios`
- `Ver perfil tecnico`
- `Inicio`
- `Servicios`
- `Perfil`
- `Contacto`

Tambien hay orden de secciones fijo: `#servicios`, `#perfil`, `#faq`, `#contacto`.

Referencia: [HomePage.ts](../src/ui/pages/HomePage.ts#L15)

Implicacion: si el backend define una landing con otra arquitectura de secciones, el frontend actual seguiria imponiendo parte de la navegacion.

### 5. Hay heuristicas hardcodeadas para iconografia de servicios

El icono de cada servicio se resuelve por keywords embebidas en frontend:

- `mantenimiento`
- `repar`
- `consult`
- `instal`
- `medic`
- `diag`

Referencia: [HomePage.ts](../src/ui/pages/HomePage.ts#L16)

Implicacion: el backend hoy no controla la presentacion iconografica de servicios; el frontend la infiere.

### 6. El formulario de contacto usa contenido remoto/local del repositorio, pero la home lo sobreescribe con props locales

`useContactFormSection` prioriza `props.title`, `props.subtitle` y `props.submitLabel` sobre `content.getContactContent()`.

Referencia: [ContactFormSection.ts](../src/ui/features/contact/ContactFormSection.ts#L6)

Y en la homepage esas props se pasan con copy literal:

- `Inicia tu proyecto`
- `Dejanos tus datos y te contactamos en menos de 24 horas.`
- `Enviar solicitud`

Referencia: [HomePage.vue](../src/ui/pages/HomePage.vue#L322)

Implicacion: el backend hoy no tiene control total sobre el copy del formulario mostrado en home.

### 7. La tarjeta `TecnicoACargo` tiene identidad personal hardcodeada

Este componente embebe:

- nombre: `Agustin Bustos`
- label: `Tecnico a cargo`
- CTA: `Coordinar por WhatsApp`
- fallback: `Contacto no disponible`
- imagen fija: `/media/tecnico-a-cargo.webp`

Referencia: [TecnicoACargo.vue](../src/components/TecnicoACargo.vue#L17)

Implicacion: si el tecnico, la foto o el rol deben venir desde backend/CMS, hoy no estan modelados como contenido remoto.

### 8. La vista de agradecimiento no es 100% remota

Aunque `thanksContent` viene del repositorio, el encabezado superior sigue fijo en la vista:

- `Solicitud Finalizada`
- `Volver al inicio` en `aria-label`

Referencia: [ThanksView.vue](../src/ui/views/ThanksView.vue#L15)

### 9. Los mensajes de estado global tambien estan hardcodeados

La shell principal muestra copy tecnico fijo cuando el backend no esta disponible en desarrollo:

- `Modo desarrollo sin backend.`
- `Usando fallback frontend local.`
- `endpoint:`
- `status:`

Referencia: [App.vue](../src/ui/App.vue#L12)

Implicacion: esto probablemente no deba migrarse como contenido de negocio, pero si es copy visible hardcodeado.

### 10. `runtimeProfiles.json` contiene contenido comercial y de marca embebido en frontend

Ese archivo incluye por target:

- nombre de marca
- descripcion SEO
- URLs del sitio y OG image
- email de contacto
- WhatsApp URL
- mensaje del QR de WhatsApp
- base operativa
- nombres comerciales de equipos

Referencias:

- [runtimeProfiles.json](../src/infrastructure/content/runtimeProfiles.json#L2)
- [runtimeProfiles.json](../src/infrastructure/content/runtimeProfiles.json#L56)

Implicacion: aunque parte de esto es configuracion tecnica, otra parte es claramente contenido comercial y de marca que hoy sigue versionado en frontend.

### 11. Existe al menos un componente con FAQ completamente hardcodeada y aparentemente fuera del flujo principal

`FaqSection.vue` contiene 4 preguntas y respuestas literales, ademas con problemas de encoding visibles en el archivo.

Referencia: `src/ui/sections/FaqSection.vue` (referencia historica)

Implicacion: es contenido hardcodeado verificable. No pude confirmar solo con ese archivo si hoy forma parte del flujo renderizado principal o si quedo residual.

## Resumen operativo

Hoy el frontend tiene tres capas de contenido embebido:

1. fallback estructural completo en `landingContentBuilder.ts`
2. configuracion comercial/de marca en `runtimeProfiles.json`
3. copy suelto dentro de vistas y componentes (`HomePage.vue`, `HomePage.ts`, `TecnicoACargo.vue`, `ThanksView.vue`, `App.vue`, y posiblemente `FaqSection.vue`)

Para una migracion limpia al backend, no alcanza con mover solo el payload de `contentApiUrl`; tambien hay que decidir que hacer con el copy incrustado en las vistas y con la configuracion comercial hoy alojada en perfiles runtime.

## Respuestas inferidas con evidencia y buenas practicas

### A. Que deberia migrarse al backend y que no

#### Configuracion de marca y SEO

Con evidencia del repo, `siteName`, `siteDescription`, `contactEmail`, `brandName`, `brandAriaLabel`, `baseOperativa` y `whatsappQrMessage` viven en [runtimeProfiles.json](../src/infrastructure/content/runtimeProfiles.json#L2) y luego impactan en SEO, configuracion publica, contacto y contenido.

Referencias:

- [publicConfig.ts](../src/infrastructure/config/publicConfig.ts)
- [defaultSeo.ts](../src/application/seo/defaultSeo.ts)
- [appSeo.ts](../src/ui/seo/appSeo.ts)

Inferencia recomendada:

- `brandName`, `brandAriaLabel`, `siteName`, `siteDescription`, `contactEmail`, `baseOperativa` y `whatsappQrMessage` son mas cercanos a "brand/config content" que a contenido editorial puro.
- Buenas practicas: separarlos del contenido de landing y modelarlos como `brand/config` o `site settings`, no mezclarlos con `hero/services/faq`.
- No recomendaria dejarlos enterrados en frontend si el objetivo es que backend gobierne la experiencia comercial.

#### Mensajes tecnicos de fallback

Los mensajes de estado tecnico en [App.vue](../src/ui/App.vue#L12) y en [landingContentBuilder.ts](../src/infrastructure/content/landingContentBuilder.ts#L7) existen para sostener operacion cuando falla el backend de contenido.

Inferencia recomendada:

- Buenas practicas: estos mensajes deben seguir estando controlados por frontend.
- Motivo: dependen del estado tecnico local de la app y son parte del mecanismo de resiliencia del cliente.
- Excepcion: si queres customizar tono/branding, podria existir una pequena configuracion remota, pero el fallback minimo debe quedar local.

#### Identidad del bloque tecnico a cargo

`TecnicoACargo.vue` hardcodea nombre, rol, CTA e imagen en [TecnicoACargo.vue](../src/components/TecnicoACargo.vue#L17).

Inferencia recomendada:

- Si el tecnico a cargo puede cambiar por marca, por unidad de negocio o por campaÃ±a, deberia migrarse a backend o al menos a `brand/config`.
- Si la identidad es estable y forma parte fija de la marca personal, puede quedarse local.
- Por buenas practicas de escalabilidad, conviene sacarlo del componente y modelarlo como contenido o configuracion.

### B. Estado de `FaqSection.vue`

`FaqSection.vue` contiene FAQ hardcodeada, pero el componente no aparece referenciado en el flujo actual segun busqueda en `src/router`, `src/ui` y `src/main.ts`.

Referencia: `src/ui/sections/FaqSection.vue` (referencia historica)

Nueva certeza:

- `FaqSection.vue` es codigo residual no conectado al flujo principal actual.

Nueva duda:

- No se puede afirmar solo desde el repo si se conserva como prototipo descartable o si se quiere reusar luego.

### C. La pagina de contacto tambien mezcla contenido remoto con copy local

La `ContactPage` usa `contact.title` y `contact.subtitle`, pero mantiene copy local adicional:

- `Inicio`
- `Contacto`
- `Canales disponibles`
- lista de 3 bullets de soporte/canales
- `Volver al inicio`
- overrides de submit label y canal email

Referencia: [ContactPage.vue](../src/ui/pages/ContactPage.vue#L1)

Nueva certeza:

- El problema de hardcoding no esta limitado a `HomePage.vue`; tambien afecta `ContactPage.vue`.

### D. Recomendacion de arquitectura

La separacion mas limpia, segun el estado real del repo, es:

1. `content`
   hero, services, about, profile, legal, contact copy, faq, thanks
2. `brand/config`
   brandName, brandAriaLabel, baseOperativa, contactEmail, whatsappUrl, whatsappQrMessage, imagenes/personas de marca
3. `seo`
   siteName, siteDescription, og image, locale y metadatos de negocio
4. `frontend operational fallback`
   mensajes tecnicos de carga, indisponibilidad y desarrollo offline

Esta separacion coincide mejor con lo que hoy ya esta dividido de facto entre `contentRepository`, `runtimeProfiles`, SEO y shell de la aplicacion.

## Nuevas dudas

- No esta definido si `ContactPage.vue` debe quedar como pagina editorial configurable por backend o como pagina funcional con copy local estable.
- No esta definido si el bloque `TecnicoACargo` representa una persona fija de marca o una entidad comercial variable por tenant/marca.
- No esta definido si los perfiles `runtimeProfiles.json` deben sobrevivir solo como fallback local por entorno o desaparecer en favor de configuracion remota.


