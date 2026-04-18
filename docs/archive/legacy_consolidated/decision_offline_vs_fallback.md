# Análisis Comparativo: Fallas de Conectividad en Formularios

Este documento analiza las dos opciones disponibles para manejar los envíos de formularios (`ContactRequest`) cuando el backend o los servicios subyacentes (`/health`) están inactivos o fallan por problemas de red.

## 1. Resumen de Opciones

### Opción A: Circuito de Reintentos Local (Offline Queueing)
**Qué es:** Un mecanismo en el frontend que detecta la falla temporal de red/backend, intercepta el intento fallido y guarda en caché persistente (`localStorage` o `IndexedDB`) el payload completo del usuario.
**Cómo funciona:** El usuario visualiza un mensaje de éxito modificado (ej. *"Recibimos tus datos, se enviarán en cuanto tu conexión se restablezca"*). Un worker o servicio local perita periódicamente (o en el evento `online` del navegador) e intenta reenviar la cola oculta.
**Supuestos:** Asume que la mayoría de los errores son caídas micro-temporales de red del cliente, no paradas críticas y prolongadas del sistema del backend.

### Opción B: Fallback a Canal Secundario (WhatsApp/Manual) - *Estado Actual*
**Qué es:** Política de error estricto de negocio ("fail-fast"). 
**Cómo funciona:** Si el envío o el monitor de red fallan, se le presenta inmediatamente al usuario un mensaje de error claro indicando la indisponibilidad sistémica, acompañado obligatoriamente de un botón CTA (Call To Action) para comunicarse directamente vía WhatsApp.
**Supuestos:** Asume que el contacto es sensible al tiempo (el cliente quiere repuesta *ahora*). Retardar o enmascarar un envío puede frustrar más al cliente que la transparencia en un sistema averiado. 

---

## 2. Ventajas y Desventajas

### Opción A: Offline Queueing
**Ventajas:**
- **Impacto a conversión (Teórico):** Puede capturar leads de usuarios en movimiento (ej. enviando en un tren o subte donde se pierde la señal justo al dar "Enviar").
- **UX Percepción:** Hace sentir que el sitio es una aplicación moderna robusta ("Offline-first").
**Desventajas:**
- **Riesgo:** Alta fricción si el backend está caído por horas. El lead se encola localmente, el usuario cree que se envió, la empresa no lo recibe inmediatamente, y el cliente final no recibe respuesta.
- **Mantenibilidad:** Requiere código asíncrono pesado: *Service Workers*, sincronización de estados, des-serializado seguro y manejo de expiración/duplicación de payloads (Idempotencia).

### Opción B: Fallback WhatsApp (Estado Actual)
**Ventajas:**
- **Mantenibilidad:** Código frontend extremadamente ligero. Se centra solo en UI pura y enrutamiento simple.
- **Riesgo:** Nulo riesgo del lado del cliente de "leads zombies" (personas que creen haberse comunicado pero que sus datos siguen atorados en el navegador local).
- **Conversión Real:** Redirige la fricción hacia el medio nativo de venta más utilizado localmente (WhatsApp). Un cliente que cliquea el error es un *lead* instantáneo y cálido en la bandeja de mensajería empresarial.
**Desventajas:**
- **Impacto en Usuarios:** Se traslada la carga manual al usuario si no desean usar WhatsApp y solo querían dejar un correo en el formulario asíncrono.
- **Escalabilidad:** Difícil manejo si hay un aluvión de reportes a la bandeja humana durante una caída.

---

## 3. Comparativa Directa

| Criterio | Opción A: Offline Queueing | Opción B: Fallback WhatsApp (Actual) |
| :--- | :--- | :--- |
| **Complejidad Implementación** | Alta (Requiere PWA/Workers o Listeners Persistentes) | Baja (Un UI State + Link `wa.me`) |
| **Coste (Tiempo/Recursos)** | ~2-3 Días completos de Dev/QA | Inmediato (Ya implementado / 0 Hs) |
| **Riesgo Operativo** | **Crítico:** Falsa expectativa de envío si la caída es Back-End prolongada. | Bajo: Fricción inicial pero contexto transparente. |
| **Performance Frontend** | Moderada (Sobrecarga de comprobaciones asíncronas) | Alta (Liviano) |
| **Mantenibilidad** | Baja (Mucha lógica expuesta a bordes asíncronos del navegador) | Alta (Arquitectura Limpia estándar) |
| **Escalabilidad** | Alta (Los payloads esperan pacientemente sin saturar backend) | Baja (Puede colapsar la central de atención al cliente telefónica) |
| **Impacto en usuarios** | Transparente pero demorado | Fricción frontal, pero canal alternativo cálido asegurado. |

---

## 4. Recomendación Final

**Recomendación:** Mantener la **Opción B (Fallback WhatsApp)**.

*Justificación:*
1. **Contexto de Negocio sobre Tecnología:** Un lead perdido en el limbo de `localStorage` mientras el backend está en mantenimiento es el peor escenario para ventas. Mostrar la falla y escalar rápidamente a un humano vía WA garantiza tracción comercial inmediata.
2. **Costo de Oportunidad de Ingeniería:** Invertir días de desarrollo en PWA Offline-First para un simple formulario de contacto carece de retorno positivo en este punto del producto.
3. **Simplicidad Arquitectónica:** Clean Architecture en frontend brilla cuando la capa UI es tonta (`dumb`) respecto al estado global de la red persistida.
4. **Resilencia Actual:** Los tests end-to-end existentes asumen y comprueban el fallback.

**¿En qué condiciones elegiría Opción A?**
Si la herramienta fuese un "Dashboard de Operadores de Campo" o una "Encuesta de Auditoría Rural", donde los operarios rellenan docenas de registros por fuera de cobertura 4G conociendo y esperando la recolección masiva posterior al llegar al WiFi de la base. En un *Landing de Generación de Leads* b2b, el offline-first prolongado es perjudicial.

---

## 5. Próximos Pasos (Para Proceder)

Ya que nos decantamos por la Opción B y esta arquitectura base ya está implementada, debemos pulirla en el marco de la Auditoría UX:

1. **Proceder:** Eliminar del tintero (`todo.md`) cualquier plan de creación de "Offline Queues" basándose en esta decisión.
2. **Proceder:** Integrar la respuesta visual al error duro modernizando ese "Estado" en Vue con las mejoras de Glassmorfismo estipuladas en la tarea de UX (`ux_audit_report.md`).
3. **Proceder:** Centrar los recursos en cerrar la lista pendiente actual (`docs/todo.md`), empezando por refinamiento de fuentes, transiciones y suavizado del área `.form-control`.
