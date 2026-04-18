# Migracion a WordPress Nativo - Fase 3 (Smoke Controlado)

Fecha: 2026-04-12
Dominio: `https://cursos.datamaq.com.ar`

## Acciones ejecutadas
- Se publicaron paginas migradas (`/contact/`, `/gracias/`, `/medicion-consumo-electrico-escobar/`).
- Se corrio smoke con cambio temporal de tema a `datamaq-native` y rollback automatico.
- Se verifico submit real del formulario nativo (`admin-post.php`) con nonce valido.

## Resultados principales
### Con tema previo (`twentytwentythree`)
- `/contact/` -> `200`
- `/gracias/` -> `200`
- `/medicion-consumo-electrico-escobar/` -> `200`
- `/cotizador` -> `404` (en ese momento dependia de redirect en tema nuevo)

### Con tema `datamaq-native` activo temporalmente
- `/contact/` -> `200`
- `/gracias/` -> `200`
- `/medicion-consumo-electrico-escobar/` -> `200`
- `/cotizador` -> `301` a `/contact/`
- `/gracias/` incluye `<meta name="robots" content="noindex,nofollow">`
- `/contact/` renderiza formulario con action `wp-admin/admin-post.php`
- Submit de formulario -> `302` a `/gracias/`

## Nota de vigencia
- Este documento es snapshot pre-cutover.
- Estado final consolidado: ver Fase 4 y Fase 5.
