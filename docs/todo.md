# Tablero activo

- [>] (P0) Separar contratos API por dominio funcional (pricing/health y contact/mail)
  - Clasificacion A aplicada en: `docs/dv-api-01.contrato-pricing-health.md`, `docs/dv-api-02.contrato-contact-mail.md`
  - Avance: Se dividio el contrato unico en dos documentos separados y se dejo un indice de transicion en `docs/dv-api-01.contrato-frontend-backend.md`.
  - Evidencia: `Get-Content -Raw docs/dv-api-01.contrato-pricing-health.md`; `Get-Content -Raw docs/dv-api-02.contrato-contact-mail.md`
  - Siguiente paso: Esperar confirmacion del usuario sobre mantener o eliminar el indice de transicion.
  - Siguiente accion interna ejecutable ahora: Remover `docs/dv-api-01.contrato-frontend-backend.md` si se confirma que se requieren solo dos archivos fisicos.
