# Migracion a WordPress Nativo - Fase 2 (Contenido Inicial)

Fecha: 2026-04-12
WP objetivo: `/home/datamaq/public_html/cursos`

## Resultado
Se cargo contenido inicial real en paginas clave de migracion, manteniendolas en estado `draft` para QA sin impacto en produccion.

## Paginas actualizadas
- ID `196` slug `contact` titulo `Contacto`.
- ID `195` slug `gracias` titulo `Gracias`.
- ID `197` slug `medicion-consumo-electrico-escobar` titulo `Medicion de consumo electrico en Escobar`.

## Alcance funcional cargado
- Contenido editorial base de contacto con CTA a WhatsApp y email.
- Contenido de agradecimiento para post-conversion.
- Landing de medicion con secciones:
  - propuesta de valor
  - alcance incluido
  - proceso de trabajo
  - FAQ inicial

## Notas tecnicas
- En este WP no hay plugin de formularios activo (solo LearnPress + cache + mu-plugins).
- La pagina `197` tenia `_wp_page_template = template-landing.php` (de tema inactivo), lo que bloqueaba updates por WP-CLI con `Invalid page template`.
- Se normalizo temporalmente a `default` para poder editar contenido.
- El tema activo sigue siendo `twentytwentythree`.

## Pendiente de Fase 3
- Activar `datamaq-native` solo en staging.
- Reasignar plantilla `template-landing.php` a slug `medicion-consumo-electrico-escobar` cuando el tema este activo.
- Implementar formulario nativo/plug-in en `/contact` con redireccion a `/gracias` y tracking de conversion.
- Validar redirecciones legacy (`/cotizador* -> /contact`).
