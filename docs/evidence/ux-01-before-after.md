# UX-01 - Comparativa before/after (header/nav + above the fold)

Fecha de captura: 2026-02-15 12:37 -03:00.

## Fuente de comparativa
- Before (baseline): diagnostico visual registrado en `docs/todo.md` (seccion "Adicional UI/UX", 2026-02-15).
- After (capturas locales):
  - Desktop 1280x720: `docs/evidence/ux-01-after-desktop-1280x720.png`.
  - Mobile 360x740: `docs/evidence/ux-01-after-mobile-360x740.png`.

## Metodo reproducible
- Servidor local: `npm run dev -- --host 127.0.0.1 --port 4173`.
- Captura desktop: `npx playwright screenshot --timeout 30000 --viewport-size "1280,720" --wait-for-timeout 1200 http://127.0.0.1:4173 docs/evidence/ux-01-after-desktop-1280x720.png`.
- Captura mobile: `npx playwright screenshot --timeout 30000 --viewport-size "360,740" --wait-for-timeout 1200 http://127.0.0.1:4173 docs/evidence/ux-01-after-mobile-360x740.png`.

## Resultado observado
- En 360x740 se ve H1 + subtitulo + CTA primario dentro del primer viewport.
- En desktop se observa header/nav consolidado con CTA visible en primer pantallazo.
