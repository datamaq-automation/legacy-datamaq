# CSS Guidelines

## Goals
- Keep the current look and feel while iterating on Bootstrap-based styles.
- Allow easy rollback by keeping changes small and PR-scoped.

## Current Stack
- Framework: Vue 3 + Vite + TypeScript.
- Global styles are imported in `src/main.ts`:
  - `src/styles/tokens.css`
  - `src/styles/base.css`
  - `src/styles/layout.css`
  - `src/styles/components.css`
  - `src/assets/theme.css`
  - `src/ui/styles/variables.css`
  - `src/ui/styles/base.css`
  - `src/ui/styles/app.css`
- Bootstrap CSS and Bootstrap Icons are imported in `src/main.ts`.

## Conventions
- Keep component styles in `*.css` sidecar files (e.g. `Navbar.css`), and keep `<style>` blocks in `.vue` files to a minimum.
- Add new tokens only to `src/styles/tokens.css` and avoid scattering `:root` blocks elsewhere.
- Favor `layout.css` for layout utilities and `components.css` for component-level overrides of Bootstrap classes.

## Rollback Strategy
- Each PR should limit changes to a small set of components or a single section.
- Avoid mixing unrelated refactors with styling changes.
- If a change causes regressions, revert the PR; changes should not be spread across multiple files unrelated to the target UI.

## Bootstrap Usage (as of now)
- Bootstrap CSS and icons are imported in `src/main.ts`.
- Bootstrap classes appear in layout and UI components (`container`, `row`, `col-*`, `btn`, `card`, `alert`, `navbar`, etc.).
- `src/styles/components.css` overrides Bootstrap component tokens and styles.
