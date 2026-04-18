# Migracion a WordPress Nativo - Fase 4 (Cutover Controlado)

Fecha: 2026-04-12
Dominio: `https://cursos.datamaq.com.ar`

## Accion ejecutada
- Activacion permanente del tema `datamaq-native` en WordPress.

## Verificacion post-cutover
### Estado del tema
- `stylesheet`: `datamaq-native`
- `template`: `datamaq-native`

### Rutas principales
- `/contact/` -> `200`
- `/gracias/` -> `200`
- `/medicion-consumo-electrico-escobar/` -> `200`
- `/cotizador` -> `301` a `/contact/`
- `/cotizador/abc123/web` -> `301` a `/contact/`

### SEO tecnico
- `/gracias/` incluye `<meta name="robots" content="noindex,nofollow">`.

### Formulario nativo
- Renderiza en `/contact/` con action `wp-admin/admin-post.php`.
- Submit real probado con nonce valido.
- Resultado: `302` a `/gracias/`.

## Observaciones (actualizadas)
- La raiz `/` originalmente redirigia a `/courses/` por Nginx; esto se corrigio luego en hardening.
- El push de commits del repo WP sigue pendiente por credencial SSH de solo lectura en el servidor.

## Estado final de fase
- Cutover aplicado.
- Smoke critico completado.
- Continuidad: ver Fase 5 (hardening post-cutover).
