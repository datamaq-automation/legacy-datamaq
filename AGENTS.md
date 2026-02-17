# AGENTS.md

## Objetivo
Definir un contrato operativo claro para que el agente trabaje de forma ininterrumpida y trazable.

## Politica de continuidad (obligatoria)
1. La unica fuente de verdad para prioridades y estado es `docs/todo.md`.
2. Siempre se ejecuta la tarea abierta de mayor prioridad (`P0` > `P1` > `P2`) y, dentro de la misma prioridad, en orden de aparicion en `docs/todo.md`.
3. No se piden confirmaciones intermedias. Solo se pausa con una duda `C1`.
4. El trabajo corre en bucle hasta agotar acciones internas ejecutables en el entorno actual.
5. `C1` aplica cuando falta una decision de alto nivel (nucleo funcional: entidades, reglas de negocio, casos de uso) o una definicion externa indispensable para continuar en el turno.
6. `C2` aplica a bloqueos externos no resolubles en el turno (por ejemplo: branch protection en GitHub, despliegue backend/VPS, credenciales, legal).
7. Antes de clasificar `C1` o `C2`, se ejecutan primero todas las mitigaciones internas posibles.
8. Si hay `C1`, se hace exactamente 1 pregunta cerrada. Formatos permitidos: `Si/No`, opcion unica (`A/B/C`) o multiple choice de seleccion multiple.
9. Todo avance, decision, bloqueo y evidencia se registra en `docs/todo.md` en el mismo turno.
10. No revertir cambios del usuario sin instruccion explicita.
11. Si se modifica `src/` o `tests/`, es obligatorio actualizar `docs/todo.md` y pasar `npm run lint:todo-sync`.
12. `docs/todo.md` se mantiene como tablero activo: no debe acumular tareas `[x]` ni historial repetitivo de seguimiento.
13. Si hay tareas `[x]` en `docs/todo.md`, se deben archivar en `docs/todo.done.YYYY-MM.md` con `npm run todo:archive` en el mismo turno.
14. `quality:gate` es solo validacion; no debe ejecutar comandos que muten `docs/todo.md` (por ejemplo `todo:archive` o `todo:compact:noise`).
15. Si hubo cambios en `src/` o `tests/`, antes de cerrar turno se debe correr `npm run quality:merge` (runner no fail-fast), luego `npm run lint:todo-sync:merge-ready`, y registrar evidencia en `docs/todo.md`.
16. No cerrar turno mientras exista algun `P0` abierto con `Siguiente accion interna ejecutable ahora:` que sea realizable en este entorno.
17. La ultima seccion del mensaje final es obligatoria y exclusiva:
   - Si existe `C1`: `Pregunta de alto nivel` con exactamente 1 pregunta cerrada.
   - Si no existe `C1`: `Tareas externas` con bloqueadores `C2` y acciones recomendadas fuera del repo.
   - Si no hay tareas externas activas: indicar `Sin tareas externas activas`.
18. Si se modifican `src/`, `tests/`, `scripts/`, `AGENTS.md` o `package.json`, ejecutar `npm run lint:security` y registrar evidencia en `docs/todo.md`.
19. Si se modifican `src/` o `tests/`, registrar evidencia explicita de `npm run lint:test-coverage` (umbral de cobertura).
20. La politica permanente de automatizacion de tests se define en `AGENTS.md`; la ejecucion priorizada y evidencia del turno se define en `docs/todo.md`.
21. Si existe bloqueo `C2` de deploy/operacion, `docs/todo.md` debe mantener el ultimo intento de validacion tecnica y una `Siguiente accion interna ejecutable ahora` condicionada al dato externo faltante.
22. Si un cambio cruza capas (`ui`, `application`, `domain`, `infrastructure`), validar limites arquitectonicos con `npm run lint:layers` y registrar decision tecnica en `docs/todo.md`.
23. Si se modifica `src/ui/` o archivos `.vue`, ejecutar `npm run test:a11y` y `npm run check:css`, y registrar evidencia en `docs/todo.md`.
24. Si se modifica `src/ui/`, archivos `.vue` o `tests/e2e/`, ejecutar `npm run quality:responsive` en orden estricto (`XS -> SM -> MD -> LG`) y registrar evidencia por etapa en `docs/todo.md`.
25. No avanzar a una etapa de viewport superior mientras la etapa anterior no este en verde (bloqueo secuencial obligatorio).
26. Si se modifica `src/ui/`, archivos `.vue` o `tests/e2e/`, ejecutar `npm run quality:mobile` luego de `quality:responsive` para consolidar smoke + a11y + CSS, y registrar evidencia en `docs/todo.md`.

## Protocolo operativo por turno
1. Leer `docs/todo.md`.
2. Tomar la tarea abierta mas prioritaria.
3. Clasificar la accion como `A`, `B` o `C` (`C1`/`C2` si aplica).
4. Ejecutar cambios minimos y trazables.
5. Validar con comandos acordes al cambio.
6. Si hubo cambios en `src/`, `tests/`, `scripts/`, `AGENTS.md` o `package.json`, ejecutar `npm run lint:security`.
7. Si hubo cambios en `src/ui/`, archivos `.vue` o `tests/e2e/`, ejecutar `npm run quality:responsive` (secuencial por etapas) y registrar evidencia por etapa.
8. Si hubo cambios en `src/ui/`, archivos `.vue` o `tests/e2e/`, ejecutar `npm run quality:mobile` y registrar evidencia.
9. Si hubo cambios en `src/` o `tests/`, ejecutar `npm run quality:merge` para exponer en una sola corrida los fallos de `quality:gate`, `quality:responsive` y `quality:mobile`, y cerrar con `npm run lint:todo-sync:merge-ready`.
10. Registrar evidencia concreta (archivos, comandos, fecha) en `docs/todo.md`.
11. Si quedaron tareas `[x]` en `docs/todo.md`, ejecutar `npm run todo:archive` y volver a validar.
12. Si hay ruido operativo repetitivo (entradas de `Avance/Evidencia/Mitigacion` sin valor incremental), compactar con `npm run todo:compact:noise` y volver a validar.
13. Repetir desde el paso 2 mientras haya acciones internas ejecutables.
14. Cerrar con la seccion final obligatoria segun regla 17.

## Marco A/B/C
### A) Certeza total
- Implementar directo.
- Validar al menos con `npm run typecheck`, `npm run lint:test-coverage` y `npm run build`.
- Si hubo cambios en `src/` o `tests/`, sumar `npm run quality:merge`.
- Registrar evidencia.

### B) Duda de bajo nivel (infra/implementacion)
- Proponer 2-3 opciones breves.
- Elegir 1 con motivo tecnico corto.
- Implementar sin preguntar al usuario.
- Registrar `Decision tomada (B): ...` y evidencia.
- Circuito SB (duda de ciberseguridad de bajo nivel): comparar opciones por superficie de ataque/blast radius y elegir la de menor exposicion operativa.
- Registrar `Decision tomada (B-Seguridad): ...` cuando aplique.
- Circuito TB (duda de testing de bajo nivel): comparar opcion de prueba (unitaria/integracion/e2e/contrato), elegir la de mejor signal-to-noise y menor fragilidad.
- Registrar `Decision tomada (B-Testing): ...` cuando aplique.
- Circuito DB (duda de deploy/operacion de bajo nivel): comparar opciones por facilidad de rollback y menor riesgo de corte en produccion.
- Registrar `Decision tomada (B-Deploy): ...` cuando aplique.
- Circuito AB (duda de arquitectura de bajo nivel): comparar opciones por acoplamiento/costo de cambio y elegir la de menor dependencia transversal.
- Registrar `Decision tomada (B-Arquitectura): ...` cuando aplique.
- Circuito VB (duda de Vue de bajo nivel): comparar opciones por legibilidad de componente, reuso en composables y menor riesgo de regresion visual.
- Registrar `Decision tomada (B-Vue): ...` cuando aplique.

### C) Duda de alto nivel
- Ejecutar mitigaciones internas primero.
- Clasificar como `C1` o `C2`.
- No modificar codigo dentro del alcance bloqueado.
- Mantener la tarea en `[ ]` o `[>]`.
- Circuito SC (duda de ciberseguridad de alto nivel): usar `C1/C2` para modelo de confianza, politicas legales, retencion de datos o credenciales maestras.
- Circuito TC (duda de testing de alto nivel): usar `C1/C2` para criterios de aceptacion de negocio, alcance de regresion requerido por producto o entornos externos no disponibles.
- Circuito DC (duda de deploy/operacion de alto nivel): usar `C1/C2` para host canonico, estrategia CDN/WAF, politicas TLS/headers o decisiones de proveedor externo.
- Circuito AC (duda de arquitectura de alto nivel): usar `C1/C2` para redefinir limites de dominio, ownership entre capas o contratos base de puertos/adaptadores.
- Circuito VC (duda de Vue de alto nivel): usar `C1/C2` para decisiones de framework/estilo global (design system, estrategia de render/SSR, librerias base de UI) o dependencias externas no disponibles.

Plantilla obligatoria para `C`:
- `Decision tomada (C): ...`
- `Tipo C: C1|C2`
- `Bloqueador residual: ...`
- `Informacion faltante: ...`
- `Mitigacion interna ejecutada: ...`
- `Pregunta cerrada pendiente (solo C1): ...`
- `Tareas externas (solo C2 y acciones fuera del repo): ...`
- `Siguiente paso: ...`
- `Siguiente accion interna ejecutable ahora: ...`

## Politicas de dominio vigentes
- Consentimiento: `hard revoke`.
- Al pasar a `denied`: bloquear tracking futuro, propagar denegacion a proveedores y limpiar cookies first-party de analytics en modalidad best-effort.
- Referencia: `docs/dv-priv-01.md`.

## Dimension de ciberseguridad (obligatoria)
- Principio: `least privilege` en frontend y en CI.
- En `src/`, `tests/` y `.env.example` quedan prohibidos:
  - Variables `VITE_*` con credenciales/sensibles (`SECRET`, `TOKEN`, `PASSWORD`, `API_KEY`, `CLIENT_SECRET`, `PRIVATE_KEY`, `ACCESS_KEY`).
  - Headers de autenticacion sensible en navegador (`Authorization`, `X-API-Key`, `X-Api-Key`, `X-Auth-Token`).
- Si una integracion requiere auth sensible desde cliente, clasificar primero como `C1` (decision de arquitectura) antes de implementar.
- Brechas de infraestructura externa (por ejemplo HTTPS redirect, HSTS, CSP, headers de servidor) se clasifican como `C2` con plan fuera del repo.
- Guardrails obligatorios:
  - `npm run lint:origin-verify`
  - `npm run lint:client-secrets`
  - `npm run lint:security`

## Dimension de testing (obligatoria)
- Principio: cada cambio relevante debe tener deteccion automatica de regresion proporcional al riesgo.
- Automatizacion operativa: ante fallo de `test`, `lint:test-coverage`, `test:e2e:smoke` o `lint:testing`, ejecutar ciclo detectar -> corregir -> revalidar sin pedir confirmacion intermedia.
- Alcance por defecto para autocorreccion: primero ajustar `tests/`; si no alcanza para resolver el fallo, aplicar ajuste minimo en `src/` y mantener cobertura asociada.
- Escalar por circuito `TC` solo cuando el bloqueo dependa de criterio de aceptacion de negocio o de entorno externo no disponible en este turno.
- Cobertura minima global bloqueante (sobre `coverage/coverage-summary.json`):
  - `lines >= 75%`
  - `statements >= 75%`
  - `functions >= 80%`
  - `branches >= 65%`
- Guardrails obligatorios:
  - `npm run lint:test-coverage`
  - `npm run test:e2e:smoke`
  - `npm run lint:testing`
- Si la cobertura baja de umbral, no se cierra turno hasta recuperar baseline o clasificar `C` con mitigaciones internas.
- Casos criticos (contacto, consentimiento, navegacion principal) deben mantener al menos 1 prueba automatizada estable por flujo.

## Dimension de arquitectura limpia (obligatoria)
- Principio: dependencias dirigidas hacia adentro y separacion explicita de responsabilidades por capa.
- Reglas minimas:
  - `domain` no depende de `application`, `infrastructure` ni `ui`.
  - `application` depende de `domain` y puertos; no consume detalles de framework/UI.
  - `infrastructure` implementa puertos y adapta IO externo sin mover reglas de negocio fuera de `domain`/`application`.
  - `ui` orquesta casos de uso/controladores; no incorpora logica de negocio critica en componentes.
- Guardrails obligatorios:
  - `npm run lint:layers`
  - `npm run typecheck`
  - `npm run test`
- Si un cambio requiere romper un limite de capa, clasificar `C` y documentar mitigacion antes de implementar.

## Dimension de buenas practicas Vue (obligatoria)
- Principio: componentes predecibles, tipados y con responsabilidad acotada.
- Reglas minimas:
  - Componentes `.vue` orientados a presentacion/orquestacion; la logica reutilizable vive en composables/controladores (`*.ts`).
  - `props` y `emits` deben mantenerse tipados y explicitos para evitar contratos implicitos.
  - Evitar efectos colaterales en template; manejar efectos en `setup`/composables con limpieza explicita.
  - Priorizar selectores estables de componente en pruebas E2E sobre textos fragiles.
  - Mantener semantica y accesibilidad base (roles, etiquetas, foco, navegacion por teclado).
- Guardrails obligatorios:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:a11y`
  - `npm run check:css`
  - `npm run quality:responsive`
  - `npm run quality:mobile`
- Si una mejora Vue requiere redefinir framework de UI o convenciones globales de producto, clasificar `C` por circuito `VC` antes de implementar.

## Dimension frontend lead CSS/SCSS + Bootstrap (obligatoria cuando aplique)
- Rol por defecto para auditorias de estilos: actuar como `Frontend Lead (Vue 3 + Vite SSG)` con foco en arquitectura `CSS/SCSS` y `Bootstrap 5.3.x`.
- Contexto tecnico confirmado del proyecto:
  - Bootstrap por npm con personalizacion SCSS en `src/styles/vendors/bootstrap.custom.scss`.
  - Bootstrap JS bundle e icons importados desde `main.ts`.
  - Compilacion con Vite + `sass` (sin PostCSS/Autoprefixer/Stylelint/Prettier por defecto).
  - Estructura de estilos ITCSS-like en `src/styles/` + CSS adicional en secciones/componentes.
- Prioridad por defecto si el usuario no define otra:
  - `A`: eliminar `!important` y consolidar CSS duplicado.
  - `D`: reducir deuda tecnica (fosiles y reorganizacion de overrides).
  - `B`: setup minimo y no disruptivo de guardrails.
  - `C`: dark/light toggle solo con enfoque confirmado.
- Secuencia de ejecucion obligatoria:
  1. Analisis de alto nivel (arquitectura/estructura/dependencias/convenciones y relacion Bootstrap-SCSS) sin implementar cambios que dependan de decisiones de estrategia no confirmadas.
  2. Plan de bajo nivel priorizado.
  3. Implementacion solo en certezas (cambios seguros, reversibles y de bajo riesgo).
- Manejo de dudas:
  - Duda de bajo nivel: presentar 2-3 opciones con pros/contras, recomendacion tecnica e implementacion sugerida.
  - Duda de alto nivel: no cambiar codigo dentro del alcance bloqueado y cerrar con exactamente 1 pregunta de alto nivel.
- Entregable obligatorio en auditorias CSS/SCSS:
  - `A) Analisis de alto nivel (sin cambios)`: mapa ITCSS, mapa de integracion Bootstrap, riesgos/antipatrones con evidencia y lista de certezas/desconocidos.
  - `B) Plan de bajo nivel`: backlog priorizado (`P0/P1/P2`) con esfuerzo (`S/M/L`), impacto, riesgo y archivos.
  - `C) Implementacion (solo certezas)`: diffs/snippets antes-despues + checklist de verificacion (build, bundle CSS, regresion visual sugerida, warnings SCSS).
  - `D) Cierre`: si hay duda de alto nivel, 1 sola pregunta; si no, declarar explicitamente `No hay preguntas de alto nivel; tareas finalizadas`.
- Cambios tipicos permitidos cuando hay certeza:
  - Reducir/eliminar `!important` via cascada/especificidad/orden ITCSS/utilidades Bootstrap.
  - Consolidar CSS duplicado (`src/ui/sections/*.css` vs SCSS central).
  - Encapsular overrides fragiles en ubicacion clara sin re-arquitectura masiva.
  - Retirar o aislar assets fosiles solo si su desuso esta verificado.
  - Integrar `check:css` al gate solo si es directo y no disruptivo.

## Dimension de deploy/operacion (obligatoria)
- Principio: cada release debe ser verificable, trazable y con riesgo de rollback controlado.
- Si se tocan `./.github/workflows/`, scripts de despliegue o configuracion publica (`src/infrastructure/config/publicConfig.ts`), registrar en `docs/todo.md` evidencia de validacion tecnica local y el impacto esperado en produccion.
- Guardrails operativos del repo:
  - Mantener `npm run quality:merge` en verde cuando cambian `src/` o `tests/`.
  - Cerrar cambios con `npm run lint:todo-sync:merge-ready` cuando cambian `src/` o `tests/`.
  - Ejecutar `npm run smoke:contact:backend -- <url>` cuando se disponga de `inbox_identifier` productivo para validar flujo de contacto extremo a extremo.
- Bloqueos externos de deploy/operacion (clasificar `C2`):
  - DNS/CDN/WAF, certificados TLS, headers server-side (`HSTS`, `CSP`, etc.), host canonico y redirecciones.
  - Configuracion productiva de Chatwoot (`inbox_identifier`, `secure mode`, `identifier_hash`).
- Si falta una definicion externa de deploy/operacion, no cerrar como resuelto: mantener `Tipo C: C2`, `Informacion faltante`, `Tareas externas` y `Siguiente accion interna ejecutable ahora`.

## Compliance automatizado
- Comando obligatorio: `npm run lint:security`.
- Comando obligatorio: `npm run lint:test-coverage`.
- Comando obligatorio: `npm run lint:todo-sync`.
- Comando obligatorio de cierre cuando cambian `src/` o `tests/`: `npm run lint:todo-sync:merge-ready`.
- Regla base: falla si hay cambios en `src/` o `tests/` sin cambios en `docs/todo.md`.
- Regla estricta: si hay cambios en `src/` o `tests/`, `docs/todo.md` debe incluir trazabilidad explicita (`Evidencia`, `Avance`, `Decision`, `Bloqueador`, `Siguiente paso` o `Clasificacion`).
- Regla `P0` abierta (`--require-open-p0`): exige `Siguiente accion interna ejecutable ahora`; si hay `Decision tomada (C)` exige `Tipo C`; y para `Tipo C: C1` exige pregunta cerrada pendiente.
- Regla de limpieza (`--require-no-done-tasks`): falla si `docs/todo.md` contiene tareas `[x]`; se deben mover con `npm run todo:archive`.
- Compactacion de ruido: `npm run todo:compact:noise` es manual (no bloqueante) para mover historial repetitivo a `docs/todo.done.YYYY-MM.md`.
- Regla de no mutacion en gate: `quality:gate` valida; no debe ejecutar scripts que editen `docs/todo.md`.
- Regla de merge-ready local (`--require-merge-evidence`): si cambian `src/` o `tests/`, `docs/todo.md` debe incluir evidencia de `npm run quality:merge` (o `quality:gate` + `test:e2e:smoke`).
- Integracion obligatoria local y CI: usar los mismos flags de compliance para evitar desalineaciones.
- Regla de seguridad cliente: `lint:client-secrets` falla si detecta secretos `VITE_*` o headers sensibles en frontend.
- Regla de cobertura: `lint:test-coverage` falla si la cobertura global cae por debajo de umbrales definidos en `scripts/test-coverage-thresholds.json`.
- Regla de bloqueo externo de deploy: si existe `C2` de deploy/operacion en `docs/todo.md`, debe quedar explicito el dato externo faltante y el proximo chequeo tecnico a ejecutar en cuanto se disponga de ese dato.
- Regla de arquitectura: `lint:layers` bloquea imports que violan limites entre capas y no se cierra turno con violaciones activas.
- Regla de Vue: cambios en `src/ui/` o `.vue` deben dejar evidencia de `test:a11y` y `check:css` en `docs/todo.md`.

## Archivos asociados
- `AGENTS.md`: contrato operativo.
- `docs/todo.md`: estado y evidencia.
- `docs/todo.done.YYYY-MM.md`: archivo mensual de tareas cerradas e historial movido desde `docs/todo.md`.
- `scripts/check-todo-sync.mjs`: enforcement local/CI.
- `scripts/check-origin-verify-leaks.mjs`: guardrail de no regresion para secreto/header legado en frontend.
- `scripts/check-client-secrets.mjs`: enforcement local/CI para evitar exposicion de secretos y headers sensibles en cliente.
- `scripts/check-test-coverage.mjs`: valida umbrales minimos de cobertura global.
- `scripts/test-coverage-thresholds.json`: umbrales de cobertura bloqueantes del repositorio.
- `scripts/layerBoundaries.mjs`: reglas de dependencias permitidas entre capas.
- `scripts/smoke-contact-backend.mjs`: smoke tecnico de endpoint de contacto para validacion de despliegue.
- `scripts/run-a11y.mjs`: validacion automatizada de accesibilidad para vistas/componentes clave.
- `scripts/check-css-size.mjs`: guardrail de presupuesto CSS para evitar regresiones visuales/peso.
- `scripts/archive-todo-completed.mjs`: automatiza archivo de tareas `[x]` desde `docs/todo.md` a `docs/todo.done.YYYY-MM.md`.
- `scripts/compact-todo-noise.mjs`: compacta ruido operativo repetitivo desde `docs/todo.md` hacia `docs/todo.done.YYYY-MM.md`.
- `scripts/run-quality-merge.mjs`: ejecuta `quality:gate` + `quality:responsive` + `quality:mobile` sin fail-fast para detectar desalineaciones locales antes de push.
- `scripts/run-responsive-stages.mjs`: ejecuta validacion responsive secuencial bloqueante (`XS -> SM -> MD -> LG`) usando smoke E2E segmentado por viewport.
- `scripts/run-mobile-first-checks.mjs`: ejecuta `quality:responsive` + `test:a11y` + `check:css` sin fail-fast para validar mobile-first en una sola corrida.
- `docs/dv-depl-01.md`: inventario de pipeline y decisiones operativas de borde (incluyendo Cloudflare).
- `docs/dv-secu-01.md`: auditoria de headers y hardening de capa edge fuera del repo.
- `package.json`: integra `lint:security` + `lint:test-coverage` + `lint:todo-sync` dentro de `quality:gate` y expone `todo:archive`/`todo:compact:noise` + `lint:todo-sync:merge-ready`.
- `./.github/workflows/ci-cd-ftps.yml`: gate remoto.
