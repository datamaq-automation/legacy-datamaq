# Bootstrap CSS Optimization

Bootstrap version: 5.3.8

## Why we do not import bootstrap.min.css
We only use a subset of Bootstrap components and utilities. Importing the full
bundle ships unused CSS. We compile a custom Bootstrap build with just the
modules we need, while keeping theming driven by CSS variables in tokens and
theme styles.

## Included modules
- functions, variables, maps, mixins, utilities
- root, reboot, type
- images
- containers, grid
- buttons, forms, card, alert, nav, navbar
- spinners
- helpers
- utilities/api

## Excluded modules
- accordion, badge, breadcrumb, button-group
- carousel, close, code, dropdown
- list-group, modal, offcanvas, pagination
- placeholders, popover, progress, tables
- toast, tooltip, transitions, utilities (legacy), other components not listed

## How to add a module
1) Add the import to `src/styles/vendors/bootstrap.custom.scss` in a sensible
   order near related modules.
2) Run `npm run build` and `npm run test:a11y`.
3) Verify the UI that relies on the new module.

## Utilities subset
We intentionally generate only a subset of utilities via the utilities API to
reduce CSS size. If a utility class is missing, add its utility group back to
the `$utilities` map in `src/styles/vendors/bootstrap.custom.scss`.
