# DV-UX-03 - Tokens y componentes base

Fecha: 2026-02-15

## Objetivo
Definir un set minimo de tokens y clases base para unificar `Button`, `Chip/Badge` y `Card` sin duplicar estilos ad-hoc.

## Tokens aplicados (`src/styles/scss/_tokens.scss`)
- Tipografia:
  - `--ui-font-size-body`, `--ui-line-height-body`
  - `--ui-font-size-title`, `--ui-line-height-title`
  - `--ui-font-size-label`, `--ui-line-height-label`
- Espaciado:
  - `--ui-space-2`, `--ui-space-3`, `--ui-space-4`, `--ui-space-5`, `--ui-space-6`
- Radius:
  - `--ui-radius-sm`, `--ui-radius-md`, `--ui-radius-lg`
- Sombras:
  - `--ui-shadow-sm`, `--ui-shadow-md`
- Colores semanticos:
  - `--ui-color-bg`, `--ui-color-surface`, `--ui-color-surface-elevated`
  - `--ui-color-text`, `--ui-color-text-muted`
  - `--ui-color-primary`, `--ui-color-primary-soft`, `--ui-color-border`

## Componentes base (`src/styles/scss/_components.scss`)
- `c-ui-btn`
  - Variantes: `c-ui-btn--primary`, `c-ui-btn--outline`
  - Estados: `hover`, `focus-visible`, `disabled`/`aria-disabled`
- `c-ui-chip`
  - Variante: `c-ui-chip--success`
- `c-ui-card`
  - Variantes: `c-ui-card--elevated`, `c-ui-card--interactive`

## Adopcion en UI
- `src/ui/sections/HeroSection.vue`
- `src/ui/sections/ServiceCard.vue`
- `src/ui/layout/Navbar.vue`
- `src/ui/features/contact/ContactFormSection.vue`
- `src/ui/features/contact/ConsentBanner.vue`
- `src/ui/views/ThanksView.vue`
- `src/ui/pages/MedicionConsumoEscobar.vue`

## Criterio de uso
- CTA nuevos: `btn c-ui-btn` + variante.
- Chips/badges informativos: `c-ui-chip`.
- Superficies de contenido: `c-ui-card` + variante segun elevacion/interaccion.
