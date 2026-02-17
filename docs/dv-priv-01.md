# DV-01 - Matriz de consentimiento y tracking

## 1) Objetivo
Definir el comportamiento funcional y tecnico de consentimiento para analytics en el frontend.

Alcance:
- Google Analytics 4 (GA4)
- Microsoft Clarity
- Eventos de conversion y page views del sitio

## 2) Fuente de verdad y almacenamiento
- Clave activa: `consent.analytics`
- Clave legacy (solo migracion): `datamaq-www-consent`

Regla:
- Solo `consent.analytics` debe quedar persistida luego de cualquier lectura/escritura.
- Valores validos persistidos: `granted` o `denied`.
- Estado sin eleccion: clave ausente (se interpreta como `unknown` / `unset`).

## 3) Matriz de estados
| Estado de consentimiento | Persistencia esperada | Banner | Inicializacion GA4/Clarity | Envio de eventos/pageview |
| --- | --- | --- | --- | --- |
| `unknown` (sin decision) | sin clave | visible | bloqueada | bloqueado |
| `granted` | `consent.analytics=granted` | oculto | habilitada | habilitado |
| `denied` | `consent.analytics=denied` | oculto | bloqueada | bloqueado |

## 4) Matriz de transiciones
| Disparador | Estado origen | Estado destino | Persistencia esperada | Resultado de tracking |
| --- | --- | --- | --- | --- |
| Primera visita (sin clave) | n/a | `unknown` | sin clave | no se inicializa analytics, no se envian eventos |
| Click en "Aceptar" | `unknown` o `denied` | `granted` | `consent.analytics=granted` | se inicializa analytics y se habilita tracking |
| Click en "Rechazar" | `unknown` o `granted` | `denied` | `consent.analytics=denied` | se aplica `hard revoke` (bloqueo + revocacion) |
| Migracion legacy al cargar | `datamaq-www-consent` | `granted` o `denied` | mover valor a `consent.analytics` y borrar legacy | aplica reglas segun estado migrado |
| Revocacion desde configuracion futura | `granted` | `denied` | `consent.analytics=denied` | se aplica `hard revoke` inmediatamente |

## 5) Politica de revocacion aprobada
Decision tomada:
- Se adopta `hard revoke`.
- Fecha: 2026-02-14.
- Alcance tecnico: GA4 + Microsoft Clarity.

Comportamiento requerido al pasar a `denied`:
1. Bloquear eventos nuevos (`contact`, `generate_lead`, `page_view`).
2. Propagar estado de consentimiento `denied` a GA4 y Clarity.
3. Limpiar cookies first-party de analytics en el navegador (best-effort).
4. Limpiar cola pendiente de eventos GA4 para evitar envios tardios.

Notas operativas:
- No existe aun panel publico de preferencias para revocacion posterior; cuando exista, debe reutilizar la misma ruta `hard revoke`.
- La limpieza de cookies aplica a cookies first-party alcanzables por JS en el dominio actual.

## 6) Eventos cubiertos por la matriz
- `contact`
- `generate_lead`
- `page_view` (via tracking SPA)

Regla:
- Estos eventos solo pueden salir cuando el estado es `granted`.

## 7) Evidencia tecnica actual (implementado)
- `src/application/consent/consentStorage.ts`
- `src/application/consent/consentManager.ts`
- `src/infrastructure/consent/consent.ts`
- `src/infrastructure/analytics/index.ts`
- `src/infrastructure/analytics/ga4.ts`
- `src/infrastructure/analytics/clarity.ts`
- `src/infrastructure/analytics/cookies.ts`
- `src/infrastructure/analytics/browserAnalytics.ts`
- `src/main.ts`

Tests:
- `tests/unit/application/consentManager.test.ts`
- `tests/unit/infrastructure/consent.test.ts`
- `tests/unit/infrastructure/analyticsConsentSync.test.ts`
- `tests/unit/infrastructure/analyticsCookies.test.ts`
- `tests/unit/infrastructure/browserAnalytics.test.ts`

## 8) Checklist de aprobacion DV-01 (Product/Legal)
- [x] Se aprueba que `unknown` implique bloqueo total de analytics.
- [x] Se aprueba que `denied` implique bloqueo total de analytics.
- [x] Se define politica de revocacion (`hard revoke`).
- [ ] Se valida texto legal/politica de privacidad alineado con la decision.
- [x] Se confirma que la implementacion tecnica cumple la politica aprobada.

## 9) Referencias tecnicas (proveedores)
- Google tag / Consent Mode:
  - https://developers.google.com/tag-platform/security/concepts/consent-mode
- Microsoft Clarity Consent Mode:
  - https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode
- Microsoft Clarity Consent API v2:
  - https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
