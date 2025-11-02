# Software Requirements Specification — [www.profebustos.com.ar](http://www.profebustos.com.ar) — Sitio Web de Servicios Industriales (IoT + Consultoría)

## 0. Control de cambios

| Versión | Fecha      | Descripción                                                             | Autor   |
| ------- | ---------- | ----------------------------------------------------------------------- | ------- |
| v0.1    | 2025-11-01 | Borrador inicial                                                        | [Autor] |
| v0.2    | 2025-11-01 | Correcciones de consistencia; matriz FR↔BR↔TC; activos Google Ads       | [Autor] |
| v0.3    | 2025-11-01 | Correcciones de título/dominio; se completan 1.5, 2.1, 3.2, 14.1 y 14.6 | [Autor] |

## 1. Introducción

### 1.1 Propósito

Este SRS define los requisitos de **[www.profebustos.com.ar](http://www.profebustos.com.ar)**, un sitio web orientado a promocionar y captar demanda para servicios de **instalación de dispositivos de toma de datos (IoT)** y **consultoría en interpretación de datos** eléctricos y de producción. **Audiencia**: responsables de mantenimiento, jefes de planta y direcciones técnicas de **industrias del GBA Norte** (preferentemente del sector gráfico), sin exclusión de otras industrias.

### 1.2 Alcance del producto

El sitio debe:

* **Comunicar con claridad el portafolio de servicios**: instalación de analizadores de redes eléctricas y medición de producción; consultoría para establecer **línea base** y proponer **mejoras** en **eficiencia energética por unidad** y en **OEE (disponibilidad y rendimiento)**.
* **Facilitar la conversión** mediante un **botón fijo de WhatsApp** con mensaje prellenado (ver FR-001).
* **Opcionalmente derivar** a un chat en **chat.profebustos.com.ar** cuando esté disponible (ver FR-005).

**Métrica clave**: **clics en WhatsApp** y **clics en el enlace al chat** contabilizados como **conversiones** (ver FR-006).

### 1.3 Definiciones, acrónimos y abreviaturas

* **IoT (Internet of Things):** Dispositivos conectados que capturan/trasmiten datos del proceso.
* **Línea base:** Medición inicial que describe el desempeño actual (energía/unidad, disponibilidad, rendimiento) contra la cual se comparan mejoras.
* **OEE (Overall Equipment Effectiveness):** Indicador de efectividad global del equipo. En esta fase se trabaja sobre **Disponibilidad** y **Rendimiento** (sin componente **Calidad**).
* **Disponibilidad:** Porción de tiempo que el equipo está realmente operativo respecto del tiempo planificado.
* **Rendimiento:** Relación entre la producción real y la producción teórica a la velocidad nominal.
* **kWh por unidad:** Energía eléctrica consumida por cada unidad producida.
* **CTA (Call To Action):** Llamado a la acción; en este SRS, botón flotante de WhatsApp y enlace al chat.
* **Conversión:** Evento de clic válido en CTA WhatsApp o enlace al chat (ver BR-001).
* **PII (Personally Identifiable Information):** Datos personales que identifican a una persona. En Fase 1 **no** se recolectan en el sitio.
* **WCAG 2.1 AA:** Estándar de accesibilidad web nivel AA.
* **SLA / RTO / RPO:** Nivel de servicio / Tiempo objetivo de recuperación / Punto objetivo de recuperación.

### 1.4 Referencias

* **ISO/IEC 25010:2011** — Modelo de calidad de producto/software.
* **WCAG 2.1 (W3C)** — Pautas de accesibilidad para contenido web, nivel **AA**.
* **OWASP ASVS v4.x** — Estándar de verificación de seguridad de aplicaciones *(aplica en Fase 2 si se agregan formularios/login)*.
* **Ley 25.326 (AR) – Protección de Datos Personales** y guías de la **AAIP** *(marco general; en Fase 1 no se recolecta PII)*.
* **Política de Privacidad de profebustos** *(TBD)* y **Términos y Condiciones** *(TBD).*

### 1.5 Visión general del documento

Este SRS está organizado así: (1) **Introducción** y glosario; (2) **Descripción general** del producto; (3) **Interfaces externas**; (4) **Requisitos funcionales** con criterios GWT; (5) **Datos** (fase 1 sin PII); (6) **No funcionales** (rendimiento, seguridad, accesibilidad); (7) **Reglas de negocio**; (8) **Casos de uso**; (9) **Historias**; (10) **Integración y despliegue**; (11) **Riesgos**; (12) **Criterios de aceptación**; (13) **Trazabilidad**; (14) **Anexos**.

### 1.6 Fuera de alcance (Fase 1)

* Formularios de contacto, login o registro de usuarios.
* Pasarelas de pago, cotizaciones online o agendas.
* Almacenamiento de PII o bases de datos propias.
* Dashboards analíticos internos.
* Automatizaciones que modifiquen equipos/PLC.

## 2. Descripción general

### 2.1 Perspectiva del producto

**Fase 1**: sitio **público** de una sola página orientado a **comunicar servicios** y **capturar conversiones por clic** en WhatsApp (y, opcionalmente, chat externo). **Sin backend propio** ni formularios/PII. Dependencias **externas**: `wa.me` (WhatsApp) y `chat.profebustos.com.ar` (cuando esté operativo). Evolución a **multipágina** condicionada por **BR-002**.

### 2.2 Clases y características de usuarios

**Usuarios primarios**: Gerencias de Planta/Mantenimiento; Ingeniería de Procesos; Coordinación Operativa.
**Necesidades**: reducción del consumo energético por unidad producida; mejora de disponibilidad y rendimiento; soporte experto para interpretación de datos.
**Accesibilidad/UX**: navegación simple, llamadas a la acción visibles, lenguaje técnico claro y conciso.

### 2.3 Suposiciones y dependencias

* Se cuenta con **PowerMeter** como proveedor de hardware IoT (analizador de redes eléctricas y controlador/Automate).
* Las empresas objetivo disponen de **conectividad básica** y personal capaz de interactuar por WhatsApp/Chat.
* En esta fase **no se recolectan datos personales** mediante formularios; el contacto se canaliza por **WhatsApp** o **chat externo**.
* Dependencia futura: **habilitación de** `chat.profebustos.com.ar`.

### 2.4 Restricciones

* **Fase 1 sin formularios ni login**: el sitio no recolecta PII; todo contacto es vía **WhatsApp** o **chat externo**.
* **Medición de conversiones sólo por clic** (sin identificar personas).
* **Contenido**: landing de **una sola página**; escalar a multipágina sujeto a **BR-002**.
* **Legal/comunicacional**: publicar **casos de éxito sólo con autorización** (ver **BR-003**).
* **Seguridad**: navegación **exclusivamente por HTTPS**.
* **Alcance**: **sin** pasarelas de pago ni cotizaciones online en esta fase.

### 2.5 Ambiente operativo

* **Dispositivos**: móvil, tablet y escritorio.
* **Navegadores**: últimas 2 versiones estables de Chrome, Edge, Firefox, Safari.
* **Rendimiento de referencia**: en conexión móvil típica (≥ 4G) debe cumplirse **NFR-031**.

## 3. Interfaces externas

> **Convención de IDs**: `INT-###`.

### 3.1 Interfaz de usuario (UI)

* **CTA persistente**: botón **flotante de WhatsApp** en esquina inferior derecha con mensaje prellenado: *"Vengo de la página web, quiero más información."* (FR-001).

* **Sección “Servicios”** con dos sub-secciones: (a) **Instalación** de dispositivos de toma de datos eléctricos/producción; (b) **Consultoría** para interpretación de datos y propuesta de mejoras (FR-002).

* **Texto introductorio** sobre el enfoque geográfico (GBA Norte) y sectorial (gráfico/cooperativas), sin exclusiones (FR-004).

* **Enlace opcional** “Conversar con el bot” que deriva a `chat.profebustos.com.ar` cuando esté operativo (FR-005).

* Cumplimiento de **accesibilidad** y **responsividad** según NFR-030.

* **Sección “Casos de éxito” (opcional, sujeta a BR-003..BR-006)**: si existen autorizaciones válidas, se publica una sección con 1–3 casos resumidos (antes/después, métricas y breve testimonio). Si no hay autorizaciones, se mostrará un **“Caso anónimo”** sin logos/fotos.

### 3.2 Interfaces de hardware

**No aplica en Fase 1**. El sitio no interactúa con hardware; las menciones a equipos IoT son **comerciales** (descriptivas).

### 3.3 Interfaces de software (APIs/SDKs)

* **INT-MET-001 — Medición de conversiones**: el sistema debe permitir etiquetar y contar clics en CTA de WhatsApp y enlace al chat como **conversiones** agregadas, sin PII.
* **INT-CHAT-001 — Derivación a chat**: enlace HTTP(S) hacia `chat.profebustos.com.ar` (cuando esté operativo).
* **INT-WA-001 — CTA WhatsApp**: deep-link con mensaje prellenado: *"Vengo de la página web, quiero más información."*

### 3.4 Interfaces de comunicación

* **Protocolo**: **HTTPS only** (TLS 1.2+).
* **Salidas**: enlaces salientes a `wa.me/...` (WhatsApp) y a `chat.profebustos.com.ar`.

## 4. Requisitos funcionales

> **Convención de IDs**: `FR-###`. Un requisito = una necesidad verificable.

### 4.1 Estructura de requisito (plantilla)

**ID:** FR-000
**Título:** [verbo en infinitivo + objeto]
**Descripción:** [qué + por qué + valor para el usuario/negocio].
**Actores/roles:** [quiénes interactúan]
**Disparadores:** [evento/Gatillo]
**Precondiciones:** [estado previo necesario]
**Flujo principal:** [pasos numerados]
**Flujos alternativos/excepciones:** [lista]
**Datos involucrados:** [entidades/atributos relevantes]
**Criterios de aceptación (GIVEN-WHEN-THEN):**

* GIVEN [...], WHEN [...], THEN [...].
  **Reglas de negocio aplicables:** [IDs BR-###]
  **Prioridad (MoSCoW):** [Must/Should/Could/Won’t]
  **Fuente:** [stakeholder/documento]
  **Método de verificación:** [Inspección/Prueba/Demostración/Análisis]
  **Riesgos asociados:** [breve]
  **Notas:** [opcionales]

#### Ejemplos de Criterios de Aceptación (GWT)

**FR-001 — Botón WhatsApp**

* **GIVEN** estoy en cualquier sección de la página
  **WHEN** hago clic en el botón flotante
  **THEN** se abre WhatsApp con el mensaje *"Vengo de la página web, quiero más información."*
  **AND** se registra 1 conversión de tipo **WhatsApp Click**.

**FR-002 — Sección de Servicios**

* **GIVEN** un visitante accede a la página
  **WHEN** navega a la sección "Servicios"
  **THEN** visualiza **dos sub-secciones**: Instalación (dispositivos de toma de datos eléctricos/producción) y Consultoría (interpretación/mejoras), cada una con **alcance y beneficios** descritos en lenguaje claro.
* **GIVEN** un visitante está en la sección "Servicios"
  **WHEN** recorre cada sub-sección
  **THEN** encuentra **llamadas a la acción** hacia el **CTA WhatsApp** y, cuando aplique, enlace al **chat**.

**FR-003 — Escalabilidad de contenidos**

* **GIVEN** el contenido supera el umbral definido (≥ 3 servicios **o** ≥ 800 palabras por servicio **o** ≥ 3 piezas educativas publicadas en 60 días)
  **WHEN** el modo multipágina/pestañas es **habilitado** como evolución
  **THEN** la navegación presenta **pestañas/landings por servicio** y **migas de pan/menú** actualizados, preservando accesibilidad y trazabilidad de contenidos.
* **GIVEN** el contenido **no** supera el umbral
  **WHEN** se mantiene el modo de **una sola página**
  **THEN** la sección "Servicios" continúa integrada y accesible sin pérdida de información.

**FR-004 — Enfoque geográfico/sectorial**

* **GIVEN** un visitante accede a la página
  **WHEN** lee el texto introductorio
  **THEN** queda explícita la **preferencia** por industrias del **GBA Norte** y **sector gráfico/cooperativas**, **sin exclusión** de otros clientes.
* **GIVEN** el contenido introductorio
  **WHEN** se revisa el lenguaje
  **THEN** **no** debe sugerir **restricción** o trato discriminatorio a otras industrias/regiones.

**FR-005 — Derivación a chat externo (opcional)**

* **GIVEN** un visitante ve el enlace/CTA "Conversar con el bot"
  **WHEN** hace clic
  **THEN** es redirigido a `chat.profebustos.com.ar` (si está operativo) y se registra conversión **Chat Click**.
* **GIVEN** el chat **no** está disponible
  **WHEN** el visitante hace clic
  **THEN** se presenta un **mensaje informativo** y/o se **omite** el enlace hasta su habilitación, sin errores de navegación.

**FR-006 — Medición de conversiones**

* **GIVEN** un visitante hace clic en el botón WhatsApp
  **WHEN** el evento se dispara
  **THEN** el sistema incrementa el contador de conversiones **WhatsApp Click**.
* **GIVEN** un visitante hace clic en “Conversar con el bot”
  **WHEN** el evento se dispara
  **THEN** el sistema incrementa el contador de conversiones **Chat Click**.

**FR-007 — Casos de éxito (opcional)**

* **GIVEN** existe **autorización escrita** para publicar un caso
  **WHEN** se habilita la sección "Casos de éxito"
  **THEN** se muestra al menos 1 caso con: contexto, objetivo, intervención, **métricas antes/después** y nota de autorización (sin PII no autorizada).
* **GIVEN** no hay autorizaciones válidas
  **WHEN** se evalúa publicar
  **THEN** se publica un **Caso anónimo** (sin logos/fotos) **o** se oculta la sección.

**Microcopy (Home)**

* **GIVEN** el sitio en vista **móvil 360×800**
  **WHEN** cargo la landing
  **THEN** el **H1**, el **H2** y el **CTA WhatsApp** son visibles **sin scroll**.
* **GIVEN** el héroe
  **WHEN** se valida la longitud
  **THEN** el **lead** tiene **≤ 200 caracteres** y los **beneficios** son **3 bullets** claros.
* **GIVEN** el CTA WhatsApp
  **WHEN** se abre el enlace
  **THEN** el mensaje prellenado coincide con *"Vengo de la página web, quiero más información."*.

### 4.2 Lista inicial de requisitos

* **FR-001 — Botón de WhatsApp flotante**: La página muestra un botón fijo abajo a la derecha con el mensaje prellenado *"Vengo de la página web, quiero más información."*. Se contabilizan los clics como conversiones.
* **FR-002 — Sección de Servicios**: Se incluye una sección con dos sub-secciones (Instalación de dispositivos de toma de datos eléctricos/producción; Consultoría para interpretación y mejoras) con descripciones claras de alcance y beneficios.
* **FR-003 — Escalabilidad de contenidos**: Al superar un umbral de contenido (p. ej., >2 servicios activos o >800 palabras por servicio), el sitio podrá evolucionar a **páginas/secciones dedicadas** (pestañas/landing por servicio) manteniendo navegación clara.
* **FR-004 — Enfoque geográfico/sectorial**: Se muestra un texto introductorio que explicita la preferencia por **industrias del GBA Norte** y **sector gráfico/cooperativas**, sin carácter excluyente.
* **FR-005 — Derivación a chat externo (opcional)**: Se ofrece un enlace/CTA a `chat.profebustos.com.ar` (cuando esté disponible) y se contabilizan sus clics como conversión.
* **FR-006 — Medición de conversiones**: El sistema registra la cantidad de clics en el botón de WhatsApp y en el enlace al chat como **conversiones** para análisis posterior.
* **FR-007 — Casos de éxito (opcional)**: Si existen **autorizaciones válidas**, el sitio muestra una sección con 1–3 casos con **métricas antes/después**. Si no, se muestra un **Caso anónimo** o se omite la sección (ver BR-003..BR-006).

## 5. Requisitos de datos

> **Convención de IDs**: `D-###`.

### 5.1 Modelo de datos

**No aplica en Fase 1.** El sitio no persiste datos propios ni recolecta PII; sólo se contabilizan métricas de clics.

### 5.2 Diccionario de datos (plantilla)

**Fase 1:** No se recolectan datos personales ni se gestionan entidades persistentes desde el sitio. Mantener esta **plantilla** para fases futuras.

| ID | Entidad | Atributo | Tipo | Dominio/Validación | Nulo | Descripción |
| -- | ------- | -------- | ---- | ------------------ | ---- | ----------- |
| —  | —       | —        | —    | —                  | —    | —           |

### 5.3 Retención y ciclo de vida

**Fase inicial**: El sitio **no almacena datos personales**; las interacciones se realizan vía WhatsApp/chat externo. Sólo se registran **métricas agregadas de conversión** (clics). Si en fases futuras se incorporan formularios, se definirá la política de retención/anonimización correspondiente.

## 6. Requisitos no funcionales

> **Convención de IDs**: `NFR-###`. Referenciar ISO 25010 cuando aplique.

### 6.1 Rendimiento y escalabilidad

* **NFR-031**: La **página debe cargar en ≤ 3 segundos** (p95) en conexión móvil típica (≥4G), minimizando recursos bloqueantes y tamaño de carga.
* **NFR-032**: **Core Web Vitals** en home: **LCP ≤ 2.5 s**, **INP ≤ 200 ms**, **CLS ≤ 0.1**.

> Nota: NFR-001/002 reservados para Fase 2 (si se añade backend/API).

### 6.2 Disponibilidad y continuidad

* NFR-010: [SLA 99.9% mensual].
* NFR-011: [RPO 15 min, RTO 30 min].

### 6.3 Seguridad

* **NFR-021**: El sitio debe operar **exclusivamente bajo HTTPS** con **certificado SSL/TLS válido (TLS 1.2+)** para proteger la comunicación.
* **NFR-022**: Alineamiento con **OWASP ASVS** en controles básicos de despliegue (cabeceras de seguridad, no exposición de secretos). *Controles de autenticación/autorización aplicarán en Fase 2 si se incorporan formularios/login.*

### 6.4 Usabilidad y accesibilidad

* **NFR-030**: Cumplimiento de **WCAG 2.1 nivel AA**, **diseño responsivo** (móvil/tablet/escritorio) y **navegación clara** con CTAs visibles hacia contacto/servicios.

### 6.5 Mantenibilidad y portabilidad

* NFR-040: [Cobertura de tests ≥ 80%, complejidad ciclomática, estándares de código].
* NFR-041: [Contenerización, 12-Factor, IaC].

### 6.6 Confiabilidad

* NFR-050: [MTBF/MTTR objetivos, reintentos idempotentes].

### 6.7 Cumplimiento legal y normativo

* NFR-060: [Privacidad/datos personales (indicar ley aplicable), auditorías].

## 7. Reglas de negocio

> **Convención de IDs**: `BR-###`.

| ID         | Regla                             | Descripción                                                                                                                                                            | Excepciones                                            |
| ---------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **BR-001** | Definición de conversión          | Conversión = clic válido en CTA WhatsApp o enlace al chat. Clics repetidos en <30 s cuentan 1.                                                                         | Pruebas internas/QA pueden excluirse.                  |
| **BR-002** | Escalado a multipágina            | Si en 60 días se cumplen ≥2 de: (a) ≥3 servicios activos, (b) ≥800 palabras por servicio, (c) ≥3 piezas educativas publicadas; se habilita sitio multipágina/pestañas. | Periodos con <30 visitas totales no gatillan la regla. |
| **BR-003** | Publicación de casos              | Casos de éxito requieren **autorización escrita** de la empresa o del intermediario (si aplica).                                                                       | Se admite “Caso anónimo” sin marcas ni fotos.          |
| **BR-004** | Derechos de uso de imagen y marca | Logos, fotos de instalaciones y citas textuales requieren permiso explícito con alcance (canales y plazo).                                                             | En ausencia, usar imágenes genéricas o anonimizar.     |
| **BR-005** | Anonimización por defecto         | Si falta algún permiso, se **anonimiza**: sin logos, sin fotos identificables, sin PII.                                                                                | Puede revertirse al obtener autorización.              |
| **BR-006** | Revisión previa del cliente       | Todo caso publicado debe ser **revisado y aprobado** por el cliente/intermediario.                                                                                     | N/A                                                    |

## 8. Casos de uso (opcional pero recomendado)

**UC-01 — Iniciar contacto por WhatsApp**
**Actores:** Visitante (Primario); Sitio Web (Secundario); Plataforma WhatsApp (Sistema externo).
**Objetivo:** Contactar a profebustos por WhatsApp desde el CTA.
**Precondiciones:** Landing cargada; CTA visible; conectividad disponible.
**Escenario principal:** 1) Visitante ve CTA; 2) Hace clic; 3) Se abre WhatsApp/App o Web con mensaje prellenado; 4) Se registra conversión **WhatsApp Click**.
**Extensiones/Excepciones:**

* **E1 (Sin app WhatsApp):** abrir **WhatsApp Web** en nueva pestaña; si falla, mostrar número y botón **“Copiar número”**.
* **E2 (Bloqueo de pop-up):** mostrar mensaje con enlace alternativo **“Abrir WhatsApp”**.
* **E3 (Cancelación por el usuario):** la conversión se mantiene contada por evento de clic (ver BR-001/FR-006).
  **Pre/Postcondiciones:** Tras el clic exitoso, queda 1 conversión registrada para análisis.
  **Requisitos enlazados:** FR-001, FR-006, INT-WA-001.

**UC-02 — Derivación a chat**
**Actores:** Visitante (Primario); Sitio Web (Secundario); Chat `chat.profebustos.com.ar` (Sistema externo).
**Objetivo:** Iniciar conversación con bot en `chat.profebustos.com.ar`.
**Precondiciones:** Enlace al chat visible; chat operativo (cuando aplique).
**Escenario principal:** 1) Visitante hace clic en “Conversar con el bot”; 2) Redirección a `chat.profebustos.com.ar`; 3) Se registra conversión **Chat Click**.
**Extensiones/Excepciones:**

* **E1 (Chat no disponible):** informar y ofrecer CTA WhatsApp; no presentar errores 404/5xx.
* **E2 (Tiempo de carga excesivo):** ofrecer enlace alternativo o reintento.
  **Pre/Postcondiciones:** Tras el clic exitoso, queda 1 conversión registrada para análisis.
  **Requisitos enlazados:** FR-005, FR-006, INT-CHAT-001.

## 9. Historias de usuario (si se usa enfoque ágil)

**ID:** US-###
**Como** [rol] **quiero** [capacidad] **para** [beneficio].
**Criterios de aceptación (GWT):** [lista]
**Definición de Ready/Done:** [checklist].

## 10. Requisitos de integración y despliegue

### 10.1 Integración (alto nivel, agnóstico de tecnología)

* **I-001 — Medición de conversiones:** Debe existir un mecanismo para etiquetar y contar clics en CTA WhatsApp y enlace al chat como **conversiones agregadas** (sin PII). Debe poder segmentarse por página/sección y rango temporal.
* **I-002 — Enlaces externos confiables:** Los deep-links a `wa.me/...` y `chat.profebustos.com.ar` deben validarse periódicamente (salud de destino, códigos 2xx/3xx).
* **I-003 — Aviso legal y cookies (si aplica):** Si se incorpora rastreo adicional en futuras fases, se deberá mostrar aviso/captura de consentimiento acorde a norma vigente.

### 10.2 Despliegue (alineado a NFR y reglas)

* **D-001 — HTTPS only:** Certificado SSL/TLS **válido** y renovado automáticamente; redirección **301** de HTTP→HTTPS.
* **D-002 — DNS y dominios:** Registros A/AAAA y CAA correctos para `profebustos.com.ar` y `www.profebustos.com.ar`; reserva del subdominio `chat.profebustos.com.ar`.
* **D-003 — Rendimiento inicial:** Tiempo de carga **≤ 3 s p95** (ver NFR-031) bajo conexión móvil típica (≥4G); tamaño total de recursos inicial **objetivo ≤ 1.0 MB** (orientativo, no vinculante).
* **D-004 — Observabilidad mínima:** Logs de acceso/errores de servidor y tableros de **conversión** (WhatsApp Click / Chat Click) por día/semana/mes.
* **D-005 — Contenido y cambios:** Flujo de publicación con revisión (4 ojos). Al publicar nuevos **servicios** o **piezas educativas**, evaluar **BR-002** para escalar a multipágina.
* **D-006 — Backup/rollback:** Copia de seguridad previa a releases mayores y punto de retorno documentado.
* **D-007 — Robots y metadatos:** `robots.txt` y metaetiquetas para indexación adecuada; sitemap cuando exista multipágina.
* **D-008 — Auditoría de performance:** Revisión **trimestral** de **Core Web Vitals** y **PageSpeed**; acciones correctivas si no se cumplen **NFR-031/NFR-032**.

### 10.3 Criterios de aceptación de despliegue

* **GIVEN** el sitio está en producción **WHEN** se audita el acceso **THEN** todas las rutas responden por **HTTPS** y redirigen correctamente desde HTTP.
* **GIVEN** el panel de métricas **WHEN** se ejecutan clics de prueba **THEN** se reflejan incrementos en **WhatsApp Click** y **Chat Click** el mismo día.
* **GIVEN** una conexión ≥4G **WHEN** se carga la landing **THEN** el p95 de carga es ≤ 3 s.

## 11. Gestión de riesgos

| ID       | Riesgo                                      | Impacto | Prob. | Mitigación                           | Contingencia                                    |
| -------- | ------------------------------------------- | ------- | ----- | ------------------------------------ | ----------------------------------------------- |
| **R-01** | Baja tasa de conversión                     | Medio   | M     | CTA visible, copy claro, pruebas A/B | Ajustar copy/posición del CTA                   |
| **R-02** | Dependencia PowerMeter                      | Alto    | M     | Plan alternativo de proveedor        | Ofrecer servicios compatibles con otros equipos |
| **R-03** | Conflicto en uso de casos con intermediario | Medio   | M     | BR-003 (autorización)                | Usar casos anónimos                             |

## 12. Aceptación y criterios de validación

* **Éxito inicial (60 días)**: al menos **N (TBD)** conversiones totales (WhatsApp + Chat) y tiempo de carga ≤ 3 s p95 (**NFR-031**).
* **Accesibilidad**: WCAG 2.1 AA verificada por checklist y revisión manual (**NFR-030**).
* **Seguridad**: navegación HTTPS validada con certificado SSL/TLS vigente (**NFR-021**).
* **Contenido de Servicios**: cada sub-sección (Instalación, Consultoría) presenta **≥ 120 palabras**, beneficios explícitos, alcance y CTA visibles.
* **Microcopy (Home)**: **H1/H2/CTA** visibles sin scroll en 360×800; **lead ≤ 200 caracteres**; **3 bullets**; mensaje prellenado de WhatsApp correcto.
* **Casos de éxito**: publicación condicionada a **autorización escrita**; presencia de **métricas antes/después**; opción **Caso anónimo** si falta permiso (ver BR-003..BR-006).

## 13. Matriz de trazabilidad (requisitos ↔ origen ↔ pruebas ↔ despliegue) (requisitos ↔ origen ↔ pruebas ↔ despliegue)

| Req ID | Fuente               | Caso de uso/Historia | Caso(s) de prueba            | Componente/Módulo                        | Estado    |
| ------ | -------------------- | -------------------- | ---------------------------- | ---------------------------------------- | --------- |
| FR-001 | Stakeholder: Agustín | UC-01                | TC-001 (GWT)                 | UI – CTA                                 | Pendiente |
| FR-002 | Stakeholder: Agustín | —                    | TC-004 (sección servicios)   | Contenidos                               | Pendiente |
| FR-003 | Stakeholder: Agustín | —                    | TC-005 (umbral y navegación) | Arquitectura de información / Navegación | Pendiente |
| FR-004 | Stakeholder: Agustín | —                    | TC-006 (texto introductorio) | Contenidos                               | Pendiente |
| FR-005 | Stakeholder: Agustín | UC-02                | TC-002 (GWT)                 | UI – Enlace chat                         | Pendiente |
| FR-006 | Stakeholder: Agustín | UC-01/UC-02          | TC-003 (evento conteo)       | Métricas                                 | Pendiente |
| FR-007 | Stakeholder: Agustín | —                    | TC-008 (publicación caso)    | Contenidos                               | Pendiente |

### 13.1 Matriz FR ↔ BR ↔ TC (consistencia de reglas y pruebas)

| FR                                    | Reglas de negocio (BR)              | Casos de prueba (TC) |
| ------------------------------------- | ----------------------------------- | -------------------- |
| FR-001 — Botón WhatsApp               | BR-001                              | TC-001               |
| FR-002 — Sección Servicios            | —                                   | TC-004               |
| FR-003 — Escalabilidad de contenidos  | BR-002                              | TC-005               |
| FR-004 — Enfoque geográfico/sectorial | —                                   | TC-006               |
| FR-005 — Derivación a chat            | BR-001 *(definición de conversión)* | TC-002               |
| FR-006 — Medición de conversiones     | BR-001                              | TC-003               |
| FR-007 — Casos de éxito               | BR-003, BR-004, BR-005, BR-006      | TC-008               |

> **Chequeo rápido de consistencia**: Cada FR tiene CA (GWT) y al menos un TC asociado. Las reglas BR están mapeadas donde aplican (conversión, escalado y política de casos). Si se agregan nuevos FR, actualizar ambas matrices y la sección 12.

## 14. Anexos

### 14.1 Guía de calidad de requisitos (checklist)

* **Unívoco** (no ambiguo, un solo significado)
* **Verificable** (prueba/inspección posible)
* **Necesario y valioso** (orientado a negocio/usuario)
* **Trazable** (FR ↔ BR ↔ TC enlazados)
* **Atómico** (una necesidad por FR)
* **Independiente** (evitar solapamientos)
* **No prescriptivo de implementación** (qué, no cómo)
* **Consistente** con NFR y reglas
* **Versionado** (control de cambios actualizado)

### 14.2 Plantillas reutilizables

**A. Caso de prueba (TC-###)**

* **Precondiciones:** [ ]
* **Pasos:** [1..n]
* **Resultado esperado:** [ ]
* **Datos de prueba:** [ ]
* **Severidad/Prioridad:** [ ]

**B. Endpoint REST (ejemplo)** *(plantilla — no aplica en Fase 1; conservar para Fase 2)*

* **ID:** INT-API-###
* **Ruta/Verbo:** `GET /v1/recurso`
* **Auth:** [p. ej., Bearer JWT, scope X]
* **Request:** [parámetros/headers]
* **Responses:** [200, 4xx, 5xx con esquemas]
* **Errores estándar:** [códigos/mensajes]

**C. Métrica/SLO**

* **Nombre:** [ ]

* **Definición formal:** [ ]

* **Objetivo:** [ ]

* **Fuente de datos:** [ ]

* **Visualización:** [tablero/alertas]*

* **Nombre:** [ ]

* **Definición formal:** [ ]

* **Objetivo:** [ ]

* **Fuente de datos:** [ ]

* **Visualización:** [tablero/alertas]

### 14.3 Casos de prueba instanciados

**TC-001 — WhatsApp Click (FR-001)**

* **Precondiciones:** Landing cargada, CTA visible.
* **Pasos:** 1) Hacer clic en CTA; 2) Verificar apertura de WhatsApp con mensaje; 3) Verificar registro de conversión.
* **Resultado esperado:** WhatsApp se abre con mensaje prellenado y se registra 1 conversión **WhatsApp Click**.

**TC-002 — Chat Click (FR-005)**

* **Precondiciones:** Enlace al chat visible (chat operativo).
* **Pasos:** 1) Clic en “Conversar con el bot”; 2) Verificar redirección a `chat.profebustos.com.ar`; 3) Verificar registro de conversión.
* **Resultado esperado:** Redirección correcta y 1 conversión **Chat Click**.

**TC-003 — Conteo de conversiones (FR-006)**

* **Precondiciones:** Sistema de medición habilitado.
* **Pasos:** 1) Ejecutar clic en CTA WhatsApp; 2) Ejecutar clic en enlace chat; 3) Revisar métricas.
* **Resultado esperado:** Incrementos en contadores **WhatsApp Click** y **Chat Click** sin PII.

**TC-004 — Sección Servicios (FR-002)**

* **Precondiciones:** Landing cargada.
* **Pasos:** 1) Desplazarse a “Servicios”; 2) Validar presencia de sub-secciones Instalación y Consultoría; 3) Verificar descripción de alcance y beneficios; 4) Verificar CTAs presentes; 5) Verificar longitud ≥ 120 palabras por sub-sección.
* **Resultado esperado:** Se muestran ambas sub-secciones con textos claros, CTAs a contacto y longitud mínima cumplida.

**TC-005 — Escalabilidad (FR-003)**

* **Precondiciones:** Contenidos que superen umbral (simulación o entorno de prueba).
* **Pasos:** 1) Habilitar modo multipágina/pestañas; 2) Verificar navegación por pestañas/landings; 3) Verificar migas/menú.
* **Resultado esperado:** La navegación multipágina se activa correctamente y mantiene accesibilidad.

**TC-006 — Intro geográfico/sectorial (FR-004)**

* **Precondiciones:** Landing cargada.
* **Pasos:** 1) Revisar texto introductorio; 2) Validar que menciona preferencia GBA Norte/sector gráfico/cooperativas; 3) Validar claridad de **no exclusión**.
* **Resultado esperado:** El texto refleja preferencia sin excluir a otros clientes.

**TC-007 — Microcopy (Home)**

* **Precondiciones:** Landing en vista móvil 360×800.
* **Pasos:** 1) Cargar la landing; 2) Verificar visibilidad sin scroll de H1/H2/CTA; 3) Contar caracteres del lead; 4) Contar bullets de beneficios; 5) Clic en CTA y validar mensaje prellenado.
* **Resultado esperado:** Se cumplen visibilidad, longitud y contenido del CTA.

**TC-008 — Publicación de caso de éxito (FR-007)**

* **Precondiciones:** Permisos/autorizaciones documentadas.
* **Pasos:** 1) Cargar sección; 2) Verificar presencia de contexto, objetivo, intervención y métricas antes/después; 3) Verificar nota de autorización o anonimización.
* **Resultado esperado:** Caso publicado conforme a BR-003..BR-006.

### 14.4 Borradores de textos comerciales (para publicación)

> Contenido de ejemplo para la sección **Servicios** (se puede adaptar en tono y extensión). No implica compromisos comerciales hasta su aprobación.

**A. Instalación de medidores y captura de datos industriales**
**Subtítulo propuesto:** Línea base energética y productiva en semanas, no meses.
**Alcance (qué incluye):** relevamiento in situ; instalación de medidores y puntos de captura de producción; verificación de señales; puesta en marcha y validación de lecturas; documentación básica de medición (mapa de puntos, checklist); handover operativo.
**Beneficios esperados:** visibilidad del **kWh por unidad producida**; detección de pérdidas de disponibilidad; preparación para mejoras en rendimiento; base para comparar turnos/proveedores/formato.
**Entregables:** plan de medición, informe breve de puesta en marcha, recomendaciones iniciales para estabilizar la línea base.
**Diferenciales:** experiencia en industrias del GBA Norte (preferencia por sector gráfico/cooperativas) y trabajo con dispositivos IoT de **PowerMeter**.
**CTA sugerido:** *“Hablemos por WhatsApp: contame tu línea y vemos juntos el plan de medición inicial.”*

**B. Consultoría en interpretación de datos y mejora de indicadores**
**Subtítulo propuesto:** De datos a decisiones: eficiencia energética y OEE (Disponibilidad y Rendimiento).
**Alcance (qué incluye):** análisis de **línea base** (energía/unidad, disponibilidad, rendimiento); identificación de desvíos; priorización de oportunidades; plan de mejora por impacto/esfuerzo; seguimiento opcional de resultados.
**Beneficios esperados:** reducción del consumo **por unidad**; mejora de **disponibilidad** y **rendimiento**; decisiones con evidencia y foco en retorno.
**Entregables:** **informe ejecutivo** con hallazgos y plan priorizado; guía breve para continuidad operativa.
**Diferenciales:** enfoque pragmático orientado a planta; experiencia docente para explicar y alinear equipos.
**CTA sugerido:** *“¿Querés entender dónde se va la energía y el tiempo? Escribime por WhatsApp y lo vemos.”*

**Nota legal/comunicacional:** la publicación de **casos de éxito** y/o imágenes requiere autorización previa (ver **BR-003**).

### 14.5 Microcopy final (Home)

> Pieza concisa para la landing. Tonalidad: técnico‑clara, orientación industrial.

**H1 (Título principal):** Eficiencia energética y OEE para industrias del GBA Norte
**H2 (Subtítulo):** Instalación de medidores + consultoría para interpretar datos de energía y producción
**Lead (héroe, 1–2 líneas):** Medimos **kWh por unidad** y **disponibilidad/rendimiento** para construir tu **línea base** y priorizar mejoras con retorno. Empezamos simple: visibilidad, foco y resultados.

**Beneficios (bullets cortos):**

* Línea base en semanas, no meses.
* Decisiones con datos: energía/unidad, disponibilidad y rendimiento.
* Preferencia sector gráfico y cooperativas (sin exclusiones).

**CTA primario:** **Escribime por WhatsApp**
Texto del mensaje prellenado: *"Vengo de la página web, quiero más información."*
**CTA secundario (opcional):** **Conversar con el bot** (redirige a `chat.profebustos.com.ar` cuando esté disponible).

**Sección Servicios (microcopys):**

* **Instalación de medidores** — Relevamiento, instalación y puesta en marcha para capturar energía y producción con lecturas confiables.
* **Consultoría** — Interpretamos los datos, definimos línea base y priorizamos mejoras en **energía/unidad**, **disponibilidad** y **rendimiento**.

**Disclaimer breve:** Sin formularios en esta fase: el contacto es por **WhatsApp** o **chat**. Casos de éxito publicados **solo** con autorización.

### 14.6 Plantilla de Caso de Éxito y Checklist de autorización

**Plantilla de Caso de Éxito**

* **Título del caso**
* **Empresa/sector** [o **Caso anónimo**]
* **Contexto** (línea/turno, formato, problema)
* **Objetivo** (qué se buscó mejorar)
* **Intervención** (instalación/consultoría)
* **Métricas antes/después** (kWh/unidad; disponibilidad; rendimiento)
* **Resultados y próximos pasos**
* **Autorización** (referencia/ID del permiso)
* **Medios** (opcional: foto genérica o sin imagen)

**Checklist de autorización (BR-003..BR-006)**

* [ ] Permiso escrito del cliente/intermediario.
* [ ] Alcance de uso (web/redes), plazo y revocación.
* [ ] Derechos de marca/imagen y restricciones.
* [ ] Anonimización aplicada si faltan permisos.
* [ ] Revisión y aprobación final del cliente/intermediario.

### 14.7 Activos Google Ads (borrador operativo)

> **Nota:** Se incluyen versiones **compatibles** (≤90 caracteres) y **extendidas** (91–120) para descripciones. Titulares con **≤30** caracteres. Ajustar a la plataforma elegida.

**Titulares (≤30 caracteres)**

1. Eficiencia y OEE Industrial
2. Medimos kWh por Unidad
3. Mejorá Disponibilidad y Rend.

**Descripciones — Compatibles (≤90)**
A. Instalación de medidores + consultoría. Medí kWh/unidad y mejorá disponibilidad y rendimiento.
B. Línea base en semanas. Datos claros para reducir energía por unidad y subir OEE.
C. Preferencia GBA Norte y sector gráfico. Contacto simple por WhatsApp.

**Descripciones — Extendidas (91–120)**
A+. Medición y consultoría para construir tu línea base: kWh/unidad, disponibilidad y rendimiento con foco en retorno.
B+. Instalamos medidores y analizamos datos para bajar energía/unidad y mejorar disponibilidad/rendimiento.
C+. Enfocados en industrias del GBA Norte y cooperativas. Contacto inmediato por WhatsApp.

**Sugerencias de paths**

* `profebustos.com.ar/industria`
* `profebustos.com.ar/eficiencia`
* `profebustos.com.ar/oee`

**UTM (opcional para trazado)**

* `?utm_source=google&utm_medium=cpc&utm_campaign=aw_landing&utm_content=cta_whatsapp`

**Política de conversión (ads)**

* Medir como conversión los clics en CTA WhatsApp y en “Conversar con el bot” (ver FR-006; BR-001).
