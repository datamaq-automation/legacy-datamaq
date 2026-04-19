# Repository Guidelines

## Project Structure & Module Organization
This project is a Vue 3 + Vite frontend with a layered architecture under `src/`:
- `src/domain`: core entities, value objects, and domain rules.
- `src/application`: use cases, ports, analytics/consent orchestration, DTOs.
- `src/infrastructure`: HTTP gateways, analytics adapters, storage, environment/config.
- `src/ui`: pages, sections, layout, controllers, and composables.
- `src/styles` and `src/assets`: SCSS/CSS tokens, layout/section styles, static media.
- `tests/unit` and `tests/e2e`: Vitest unit tests and Playwright smoke/end-to-end coverage.
- `docs/` and `scripts/`: operational docs and quality/security automation scripts.

## Build, Test, and Development Commands
- `npm run dev`: start local Vite dev server.
- `npm run build`: generate sitemap and production build.
- `npm run preview`: serve built output locally.
- `npm run typecheck`: strict TypeScript validation (no emit).
- `npm run test`: run unit tests with Vitest.
- `npm run test:e2e:smoke`: run Chromium smoke suite.
- `npm run test:coverage`: unit coverage report and JSON summary.
- `npm run quality:gate`: full local gate (security, coverage, a11y, CSS budget, layers).
- `npm run quality:merge`: recommended pre-merge validation bundle.

## Coding Style & Naming Conventions
- TypeScript is strict (`tsconfig.json`); keep new code type-safe and explicit.
- Use 2-space indentation and existing Vue SFC patterns (`.vue` + optional `.ts` companion).
- Prefer path alias imports from `@/...` over long relative paths.
- File naming:
  - Vue components/pages/layout: `PascalCase.vue`
  - TS modules/composables/helpers: `camelCase.ts`
  - Tests: `*.test.ts` (or `*.spec.ts` where already used)
- Enforce design tokens: avoid raw HEX colors outside token definitions (`npm run lint:colors`).

## Testing Guidelines
- Unit/UI tests use Vitest + Testing Library (`tests/setup.ts` includes `jest-dom`).
- E2E uses Playwright (`tests/e2e/smoke.spec.ts` as the baseline smoke path).
- Coverage thresholds are enforced by `scripts/check-test-coverage.mjs`; run `npm run lint:test-coverage` before PRs.

## Commit & Pull Request Guidelines
- Follow Conventional Commit style seen in history: `feat:`, `fix:`, `style:`.
- Keep commits scoped and descriptive (what changed + intent).
- PRs should include:
  - concise summary of behavior changes,
  - linked issue/task when available,
  - evidence of checks run (at minimum `npm run quality:gate`),
  - screenshots/videos for UI-visible changes.

## Security & Configuration Tips
- Start from `.env.example`; keep secrets out of Git.
- Never expose backend credentials or sensitive headers in frontend code.
- Validate client-side guardrails with `npm run lint:security`.

## Fase posterior de verificación
Después de la fase de documentación puede ejecutarse una fase de verificación de cierre.

Esa fase debe comprobar:
- cobertura de vistas documentadas
- cumplimiento estricto de `docs/plantilla.md`
- consistencia y actualización de `docs/README.md`
- calidad y utilidad real de la documentación para migración estética
- respeto de todas las restricciones operativas del repositorio

La fase de verificación no implementa cambios en WordPress.
La fase de verificación audita, reporta hallazgos y determina si la etapa documental puede darse por cerrada.