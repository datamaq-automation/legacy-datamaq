# Seguimiento de tareas — profebustos-www

_Última actualización: 11 feb 2025_

## Tareas completadas
- [x] Documentación de auditoría técnica y alternativas priorizadas (`docs/audit-2025-02-17.md`, `docs/improvement-options-2025-02-18.md`).
- [x] Activación del modo estricto de TypeScript y tipado de contratos analíticos.
- [x] Endurecimiento de configuración de entornos: normalización de URLs HTTPS y plantilla `.env.example`.
- [x] Mejora de accesibilidad en el formulario de contacto (`aria-live`, foco gestionado, mensajes consistentes).
- [x] Actualización del README con la arquitectura real y procedimientos de despliegue.
- [x] Pipeline de CI en GitHub Actions con `npm ci`, `npm run build` y auditoría de dependencias de producción.
- [x] Estrategia de pruebas automatizadas documentada (`docs/testing-strategy.md`).
- [x] Sustitución de assets pesados por ilustraciones SVG optimizadas (`src/assets/*.svg`).
- [x] Tema de alto contraste y tokens de color consistentes (`src/assets/theme.css`).
- [x] Plan de escalamiento a multipágina y guía de arquitectura (`docs/multipage-architecture-plan.md`).

## Tareas pendientes o bloqueadas
- [x] **Confirmar disponibilidad de backend de contacto en entornos de prueba.**
  - _Estado:_ Completado. Se añadió un servicio de monitoreo (`contactBackendStatus`) que verifica el endpoint en tiempo de ejecución, deshabilita el formulario cuando falla y propaga el estado al flujo de WhatsApp/email.
- [x] **Validar duplicidad de eventos en GA4 y Clarity.**
  - _Estado:_ Completado. El `analyticsTracker` ahora deduplica eventos en una ventana de 2 segundos para evitar disparos múltiples involuntarios.
- [x] **Validar accesibilidad con auditorías automatizadas.**
  - _Estado:_ Completado. Se incorporó el script `npm run test:a11y` con heurísticas sobre templates `.vue`, además del paso correspondiente en CI.
- [x] **Implementar banner de consentimiento / documentación legal.**
  - _Estado:_ Completado. Se agregó un `ConsentBanner` que bloquea la inicialización de GA4/Clarity hasta obtener consentimiento explícito y persiste la decisión en `localStorage`.
- [ ] **Definir textos legales definitivos para privacidad y cookies.**
  - _Estado:_ Bloqueado por Legal. El banner usa una redacción temporal y referencia a la sección legal existente; se requiere copy validado y política pública.

## Notas
- Las preguntas abiertas se registran aquí para seguimiento cross-team; actualizar una vez que se reciban respuestas oficiales.
- Ejecutar `npm run build` localmente antes de abrir PRs y validar que la acción de CI pasa en GitHub.
