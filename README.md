# datamaq-www

Landing corporativa construida con Vue 3 y Vite para promocionar servicios industriales de DataMaq.

## Caracteristicas principales
- SPA liviana optimizada para CTAs de WhatsApp y correo electronico.
- Integracion con API externa para registrar contactos del formulario.
- Instrumentacion analitica con GA4 y Microsoft Clarity.
- Componentes accesibles y reutilizables segun la guia de `docs/`.
- Banner de consentimiento que bloquea GA4/Clarity hasta aceptacion explicita.
- Monitoreo de disponibilidad del backend de contacto para deshabilitar el formulario cuando el servicio no responde.

## Requisitos previos
- Node.js >= 20.19.0
- npm >= 8
- Acceso al endpoint HTTPS del backend para recibir formularios.

## Configuracion de entorno
1. Copia `.env.example` a `.env` y completa los valores reales para cada entorno.
2. Verifica que `VITE_CONTACT_API_URL` apunte a un endpoint HTTPS valido.
3. Ajusta los IDs de analitica (`VITE_CLARITY_PROJECT_ID`, `VITE_GA4_ID`) segun la propiedad correspondiente.

## Instalacion y scripts
```sh
npm install         # instala dependencias
npm run dev         # servidor de desarrollo
npm run build       # compila assets para produccion en ./dist
npm run preview     # sirve el build localmente
npm run typecheck   # valida TypeScript estricto
npm run test        # ejecuta tests unitarios
npm run test:a11y   # auditoria heuristica de accesibilidad
npm run check:css   # valida presupuesto de CSS
npm run lint:colors # valida regla anti-HEX fuera de tokens
```

## Analitica y eventos
- Los eventos de compromiso se envian via `gtag` y `clarity`.
- El contrato de datos esta en `src/application/analytics/engagementTracker.ts` y `src/application/analytics/trackingFacade.ts`.
- Para evitar duplicados, se deduplican eventos en una ventana de 2 segundos.
- GA4 y Clarity solo se inicializan cuando el banner de consentimiento registra aceptacion.

## Accesibilidad
- Ejecuta `npm run test:a11y` para analizar templates `.vue`.
- Corrige hallazgos antes de desplegar cambios visuales.

## Despliegue sugerido
1. Ejecutar `npm run build` y publicar `dist/` en el hosting estatico.
2. Configurar variables de entorno en el servicio de hosting.
3. Validar respuestas `2xx` del endpoint `VITE_CONTACT_API_URL` sobre HTTPS.
4. Verificar en QA que eventos de WhatsApp y correo se registran una sola vez en GA4 y Clarity.

## Recursos adicionales
- Backlog tecnico priorizado: `docs/todo.md`.

Consultas: [contacto@datamaq.com.ar](mailto:contacto@datamaq.com.ar).
