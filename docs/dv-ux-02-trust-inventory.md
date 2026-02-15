# DV-UX-02 - Inventario de assets de confianza

Fecha: 2026-02-15
Estado: resuelto

## Confirmacion de disponibilidad
- Confirmacion de usuario: existen assets reales, verificables y con permiso de publicacion, pero aun no fueron subidos a la landing (2026-02-15).

## Inventario operativo
| Categoria | Estado actual | Fuente |
| --- | --- | --- |
| Testimonios reales | Disponible fuera del repo | Confirmacion de usuario |
| Casos reales | Disponible fuera del repo | Confirmacion de usuario |
| Logos/marcas atendidas | Disponible fuera del repo | Confirmacion de usuario |
| Certificaciones/matricula/habilitaciones | Disponible fuera del repo | Confirmacion de usuario |
| Fotos reales de intervenciones | Disponible fuera del repo | Confirmacion de usuario |

## Estado en repositorio
- `src/assets` contiene solo ilustraciones SVG genericas (`analytics-dashboard.svg`, `hero-energy.svg`, `install-tools.svg`, `powermeter.svg`, `team-training.svg`).
- No hay inventario detallado versionado de testimonios/casos/logos/certificaciones en `src/` o `docs/`.

## Decision registrada
- Se confirma disponibilidad de material real publicable (`Si`).
- Se mantiene landing sin exponer esos assets hasta su carga efectiva al repo y curado final de seleccion.
- Al integrar, limitar a 2-4 senales visibles para evitar saturacion visual y priorizar CTA.
