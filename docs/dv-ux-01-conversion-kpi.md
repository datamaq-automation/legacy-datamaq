# DV-UX-01 - KPI canonico de conversion

Fecha: 2026-02-15
Estado: resuelto

## Decision confirmada
- Opcion elegida: `A`.
- KPI primario: click a WhatsApp (`contact`).
- KPI secundario: envio de formulario (`generate_lead`).
- Lead valido: usuario que inicia conversacion por WhatsApp o envia formulario completo.

## Mapeo de eventos
- Evento primario: `contact`.
  - Origen: CTA WhatsApp en hero, navbar, footer y servicios.
  - Parametros actuales: `section`, `pageUrl`, `trafficSource`, `navigationTimeMs`.
- Evento secundario: `generate_lead`.
  - Origen: envio de formulario de contacto / thanks flow.
- Evento complementario (no KPI): `scroll_to_section`.
  - Origen: navegacion por anclas.

## Notas de implementacion
- El gating de consentimiento se mantiene centralizado en `TrackingFacade`.
- No se requieren cambios funcionales adicionales para adoptar la opcion `A` porque el mapeo ya estaba instrumentado.
