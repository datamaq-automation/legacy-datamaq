# content.ts

Este documento describe el contenido estatico definido en `src/infrastructure/content/content.ts`. El archivo exporta un objeto `content` tipado como `AppContent`, que concentra los textos, labels, mensajes y referencias a imagenes para la pagina.

## Estructura general

- `hero`: textos y CTAs del encabezado principal, junto con imagen y beneficios.
- `services`: titulo de la seccion y listado de tarjetas de servicios.
- `about`: textos y la imagen de la seccion "Sobre".
- `navbar`: marca, enlaces de navegacion y CTA de contacto.
- `footer`: nota corta al pie.
- `legal`: texto legal y de cookies.
- `contact`: labels y mensajes del formulario de contacto por email.
- `consent`: textos del banner de cookies.
- `whatsappFab`: etiqueta accesible heredada (el boton flotante fue removido).

## Imagenes

Las imagenes se importan desde `@/assets/*.svg` y se referencian dentro de cada seccion a traves de objetos `image`, `media` o `figure` con:

- `src`: referencia al asset.
- `alt`: texto alternativo.
- `width`/`height`: dimensiones sugeridas.

## Hero

Contiene el contenido principal de apertura:

- `badge`, `title`, `subtitle`: textos destacados.
- `responseNote` y `chatUnavailableMessage`: mensajes informativos.
- `primaryCta` y `secondaryCta`: CTA principal (accion `chat`) y secundario (ancla).
- `benefits`: lista de beneficios con `title`, `text` y `variant`.

## Services

`services.cards` es una lista de bloques con:

- `id`, `title`, `description`.
- `subtitle`, `items` y `note` (cuando aplica).
- `media` y `figure` para imagenes.
- `cta` con `label`, `action` y `section`.
- `unavailableMessage` para el canal de chat.

## Contact y consent

- `contact` define labels del formulario, mensajes de estado y textos de ayuda.
- `consent` define el texto del banner de cookies y botones de aceptar/rechazar.

## Uso esperado

Este objeto se consume desde la capa de UI para renderizar el sitio en un solo lugar y facilitar cambios de contenido sin tocar componentes. Mantener los textos centralizados ayuda a evitar duplicacion y mejora el mantenimiento de copys.
