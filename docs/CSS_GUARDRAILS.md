# CSS Guardrails

## Purpose
Keep CSS size and visual/a11y quality stable as Bootstrap and overrides evolve.

## Size checks
- Report size: `npm run report:css`
- Enforce budget: `npm run check:css`
- Budget lives in `scripts/css-budget.json`. Update when justified and note the
  reason in the PR description.

## Manual visual checklist (spot check)
- Navbar responsive (toggler custom Vue)
- Hero grid (container/row/col-lg-6, spacing/gap)
- Cards in Servicios (card, shadow-*, h-100)
- Buttons (btn-primary, btn-lg, btn-outline-*)
- Contact form (form-control, form-label)
- Text/bg utilities (text-body-emphasis, text-secondary, bg-dark, bg-warning-subtle)
- rounded-3, shadow-sm/lg, w-100/h-100

## A11y
- Run `npm run test:a11y` before merging changes that affect UI.
