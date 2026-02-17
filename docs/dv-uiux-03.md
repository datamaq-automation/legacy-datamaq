# DV-UX-01 - Propuesta de KPI de conversion

Fecha: 2026-02-15

## Contexto tecnico actual
- Evento `contact` ya se dispara en click a WhatsApp (`openWhatsApp`) y respeta consentimiento via `TrackingFacade`.
- Evento `generate_lead` ya existe para envio de formulario/lead.
- Evento `scroll_to_section` ya esta instrumentado para anclas de seccion.

## Opciones de KPI (cerradas)

### Opcion A (recomendada)
- KPI primario: click a WhatsApp (`contact` con `section` de CTA principal).
- KPI secundario: envio de formulario (`generate_lead`).
- Definicion de lead valido: usuario que inicia conversacion por WhatsApp o envia formulario completo.
- Motivo: el flujo comercial actual prioriza coordinacion rapida por WhatsApp.

### Opcion B
- KPI primario: envio de formulario (`generate_lead`).
- KPI secundario: click a WhatsApp (`contact`).
- Definicion de lead valido: formulario enviado.
- Motivo: prioriza datos estructurados, pero reduce sensibilidad al canal mas rapido.

### Opcion C
- KPI primario: conversion compuesta (WhatsApp + formulario ponderados).
- KPI secundario: scroll a `#contacto` (`scroll_to_section`).
- Definicion de lead valido: score minimo de interacciones.
- Motivo: mayor precision, pero mas complejidad operativa y de lectura.

## Recomendacion operativa
- Elegir Opcion A para mantener simpleza y alineacion con la operacion comercial actual.
