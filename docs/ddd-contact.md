# DDD Contact Context

Este documento resume el contexto Contact del frontend y sus limites con otros contextos.

## Context map (pragmatico)

- Contact (core): modelo de dominio, invariantes y casos de uso de contacto.
- Consent (supporting): manejo del consentimiento de analitica, solo via application.
- Analytics/Attribution (supporting/generic): tracking y attribution, siempre via puertos.

## Modelo de dominio (Contact)

- Aggregate/Entity: `ContactRequest` en `src/domain/contact/entities/ContactRequest.ts`.
- Value Objects:
  - `Email` en `src/domain/contact/value-objects/Email.ts`
  - `ContactName` en `src/domain/contact/value-objects/ContactName.ts`
- Domain errors:
  - `ContactDomainError` en `src/domain/contact/errors.ts`
- Domain services:
  - `ContactService` en `src/domain/contact/services/ContactService.ts`

## Invariantes

- Email valido (regex en `Email.create`).
- Nombre valido (minimo 2 caracteres en `ContactName.create`).
- Normalizacion de `company` y `message` (trim y null en `ContactRequest.create`).

## Aplicacion y mappers

- Caso de uso principal: `src/application/use-cases/submitContact.ts`.
- Mapper de payload HTTP: `src/application/contact/mappers/contactPayloadMapper.ts`.
- Validacion de UI: `src/application/validation/contactSchema.ts` + `src/ui/features/contact/useContactValidation.ts`.

## Eventos

- Evento de aplicacion: `ContactSubmitted` en `src/application/contact/events/ContactSubmitted.ts`.

## Reglas de dependencias

- `domain/` no depende de `application/` ni `infrastructure/`.
- `application/` orquesta y depende de puertos.
- `infrastructure/` implementa puertos.
- `ui/` solo coordina.
