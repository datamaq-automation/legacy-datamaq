# Migracion a WordPress Nativo - Fase 3 (Smoke Controlado)

Fecha: 2026-04-12
Dominio: `https://cursos.datamaq.com.ar`

## Acciones ejecutadas
- Se publicaron las paginas migradas:
  - `/contact/` (ID 196)
  - `/gracias/` (ID 195)
  - `/medicion-consumo-electrico-escobar/` (ID 197)
- Se corrio smoke con cambio temporal de tema a `datamaq-native` y rollback automatico a `twentytwentythree`.
- Se verifico submit real del formulario nativo (`admin-post.php`) con nonce valido.

## Resultados principales
### Con tema actual (`twentytwentythree`)
- `/contact/` -> `200`
- `/gracias/` -> `200`
- `/medicion-consumo-electrico-escobar/` -> `200`
- `/cotizador` -> `404` (esperable porque el redirect legacy vive en `datamaq-native`)

### Con tema `datamaq-native` activo temporalmente
- `/contact/` -> `200`
- `/gracias/` -> `200`
- `/medicion-consumo-electrico-escobar/` -> `200`
- `/cotizador` -> `301` a `/contact/`
- `/gracias/` incluye `<meta name="robots" content="noindex,nofollow">`
- `/contact/` renderiza formulario con action `wp-admin/admin-post.php`
- Submit de formulario -> `302` a `/gracias/`

## Estado final de seguridad
- Tema activo restaurado a `twentytwentythree` al finalizar pruebas.

## Pendientes para salida a produccion
- Confirmar si se activa `datamaq-native` de forma permanente en ventana controlada.
- Reubicar redirect legacy fuera del tema (mu-plugin o nginx/apache) si se quiere mantener aunque se cambie de tema.
- Integrar tracking definitivo (GA4/Clarity IDs y consentimiento final).
