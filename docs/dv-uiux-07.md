# UX-02 - Checklist manual teclado y contraste

Fecha de validacion: 2026-02-15 12:37 -03:00.

## Alcance
- Home (`/`), header/nav mobile y CTAs principales.

## Checklist teclado (manual asistido)
- [x] `Tab` inicial muestra foco visible en elementos interactivos del header/hero.
- [x] Boton menu mobile actualiza `aria-expanded` al abrir/cerrar.
- [x] Al abrir menu mobile, el foco entra al primer link de navegacion.
- [x] `Esc` cierra el menu mobile y devuelve foco al boton toggle.
- [x] Cierre de menu mobile restablece scroll del `body`.

## Checklist contraste (manual)
- [x] Texto principal del hero sobre fondo cumple contraste perceptible AA.
- [x] CTA primario mantiene contraste suficiente en estado normal/focus.
- [x] Enlaces del menu mobile conservan legibilidad sobre el fondo del overlay.

## Evidencia automatizada complementaria
- `npm run test:a11y` -> OK (incluido en `npm run quality:merge`, 2026-02-15 12:37 -03:00).
- `npm run test:e2e:smoke` -> OK (incluido en `npm run quality:merge`, 2026-02-15 12:37 -03:00).
