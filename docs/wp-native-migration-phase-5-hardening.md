# Migracion a WordPress Nativo - Fase 5 (Hardening Post-Cutover)

Fecha: 2026-04-12
Dominio: `https://cursos.datamaq.com.ar`

## Objetivo
Reducir fragilidad operativa y consolidar SEO/compatibilidad despues del cutover.

## Cambios aplicados
1. Redirecciones legacy desacopladas del tema:
   - Se movio `/cotizador* -> /contact/` a MU plugin:
     - `wp-content/mu-plugins/datamaq-legacy-route-redirects.php`
2. Hardening de bootstrap del tema:
   - `functions.php` ahora usa `__DIR__ . '/inc'` en vez de `get_template_directory()` para evitar fallo en estados mixtos `stylesheet/template`.
3. Canonicalizacion de rutas en Nginx:
   - Se elimino redirect de `/ -> /courses/`.
   - Se agrego redirect de `/courses` y `/courses/` -> `/`.
   - Archivo: `/etc/nginx/conf.d/cursos.datamaq.com.ar.conf`
   - Backups:
     - `/etc/nginx/conf.d/cursos.datamaq.com.ar.conf.bak-20260412-root-fix`
     - `/etc/nginx/conf.d/cursos.datamaq.com.ar.conf.bak-20260412-courses-canonical`

## Validacion
- `/` -> `200`
- `/courses` -> `301` a `/`
- `/courses/` -> `301` a `/`
- `/contact/` -> `200`
- `/gracias/` -> `200`
- `/cotizador` -> `301` a `/contact/`
- `/cotizador/abc123/web` -> `301` a `/contact/`

## Commits relacionados (repo wp-cursos)
- `181d8db` refactor(routing): move legacy redirects to mu-plugin and harden theme bootstrap pathing
- `5d08f63` refactor(theme): add config/forms/tracking modules and slug-based template parts
- `c70a071` refactor(theme): split native theme bootstrap into setup/assets/routing/seo modules
- `5d47b66` feat(theme): scaffold native datamaq theme for migration phase 1

## Riesgos remanentes
- Falta push remoto de `wp-cursos` (credencial actual read-only).
- Falta consolidar tracking final (IDs/consentimiento operativo definitivo).
