# Software Requirements Specification â€” [www.profebustos.com.ar](http://www.profebustos.com.ar) â€” Sitio Web de Servicios Industriales (IoT + ConsultorÃ­a)

## 0. Control de cambios

| VersiÃ³n | Fecha      | DescripciÃ³n                                                             | Autor   |
| ------- | ---------- | ----------------------------------------------------------------------- | ------- |
| v0.1    | 2025-11-01 | Borrador inicial                                                        | [Autor] |
| v0.2    | 2025-11-01 | Correcciones de consistencia; matriz FRâ†”BRâ†”TC; activos Google Ads       | [Autor] |
| v0.3    | 2025-11-01 | Correcciones de tÃ­tulo/dominio; se completan 1.5, 2.1, 3.2, 14.1 y 14.6 | [Autor] |

## 1. IntroducciÃ³n

### 1.1 PropÃ³sito

Este SRS define los requisitos de **[www.profebustos.com.ar](http://www.profebustos.com.ar)**, un sitio web orientado a promocionar y captar demanda para servicios de **instalaciÃ³n de dispositivos de toma de datos (IoT)** y **consultorÃ­a en interpretaciÃ³n de datos** elÃ©ctricos y de producciÃ³n. **Audiencia**: responsables de mantenimiento, jefes de planta y direcciones tÃ©cnicas de **industrias del GBA Norte** (preferentemente del sector grÃ¡fico), sin exclusiÃ³n de otras industrias.

### 1.2 Alcance del producto

El sitio debe:

* **Comunicar con claridad el portafolio de servicios**: instalaciÃ³n de analizadores de redes elÃ©ctricas y mediciÃ³n de producciÃ³n; consultorÃ­a para establecer **lÃ­nea base** y proponer **mejoras** en **eficiencia energÃ©tica por unidad** y en **OEE (disponibilidad y rendimiento)**.
* **Facilitar la conversiÃ³n** mediante un **botÃ³n fijo de WhatsApp** con mensaje prellenado (ver FR-001).

**MÃ©trica clave**: **clics en WhatsApp** contabilizados como **conversiones** (ver FR-006).

### 1.3 Definiciones, acrÃ³nimos y abreviaturas

* **IoT (Internet of Things):** Dispositivos conectados que capturan/trasmiten datos del proceso.
* **LÃ­nea base:** MediciÃ³n inicial que describe el desempeÃ±o actual (energÃ­a/unidad, disponibilidad, rendimiento) contra la cual se comparan mejoras.
* **OEE (Overall Equipment Effectiveness):** Indicador de efectividad global del equipo. En esta fase se trabaja sobre **Disponibilidad** y **Rendimiento** (sin componente **Calidad**).
* **Disponibilidad:** PorciÃ³n de tiempo que el equipo estÃ¡ realmente operativo respecto del tiempo planificado.
* **Rendimiento:** RelaciÃ³n entre la producciÃ³n real y la producciÃ³n teÃ³rica a la velocidad nominal.
* **kWh por unidad:** EnergÃ­a elÃ©ctrica consumida por cada unidad producida.
* **CTA (Call To Action):** Llamado a la acciÃ³n; en este SRS, botÃ³n flotante de WhatsApp.
* **ConversiÃ³n:** Evento de clic vÃ¡lido en CTA WhatsApp (ver BR-001).
* **PII (Personally Identifiable Information):** Datos personales que identifican a una persona. En Fase 1 **no** se recolectan en el sitio.
* **WCAG 2.1 AA:** EstÃ¡ndar de accesibilidad web nivel AA.
* **SLA / RTO / RPO:** Nivel de servicio / Tiempo objetivo de recuperaciÃ³n / Punto objetivo de recuperaciÃ³n.

### 1.4 Referencias

* **ISO/IEC 25010:2011** â€” Modelo de calidad de producto/software.
* **WCAG 2.1 (W3C)** â€” Pautas de accesibilidad para contenido web, nivel **AA**.
* **OWASP ASVS v4.x** â€” EstÃ¡ndar de verificaciÃ³n de seguridad de aplicaciones *(aplica en Fase 2 si se agregan formularios/login)*.
* **Ley 25.326 (AR) â€“ ProtecciÃ³n de Datos Personales** y guÃ­as de la **AAIP** *(marco general; en Fase 1 no se recolecta PII)*.
* **PolÃ­tica de Privacidad de profebustos** *(TBD)* y **TÃ©rminos y Condiciones** *(TBD).*

### 1.5 VisiÃ³n general del documento

Este SRS estÃ¡ organizado asÃ­: (1) **IntroducciÃ³n** y glosario; (2) **DescripciÃ³n general** del producto; (3) **Interfaces externas**; (4) **Requisitos funcionales** con criterios GWT; (5) **Datos** (fase 1 sin PII); (6) **No funcionales** (rendimiento, seguridad, accesibilidad); (7) **Reglas de negocio**; (8) **Casos de uso**; (9) **Historias**; (10) **IntegraciÃ³n y despliegue**; (11) **Riesgos**; (12) **Criterios de aceptaciÃ³n**; (13) **Trazabilidad**; (14) **Anexos**.

### 1.6 Fuera de alcance (Fase 1)

* Formularios de contacto, login o registro de usuarios.
* Pasarelas de pago, cotizaciones online o agendas.
* Almacenamiento de PII o bases de datos propias.
* Dashboards analÃ­ticos internos.
* Automatizaciones que modifiquen equipos/PLC.

## 2. DescripciÃ³n general

### 2.1 Perspectiva del producto

**Fase 1**: sitio **pÃºblico** de una sola pÃ¡gina orientado a **comunicar servicios** y **capturar conversiones por clic** en WhatsApp. **Sin backend propio** ni formularios/PII. Dependencias **externas**: `wa.me` (WhatsApp). EvoluciÃ³n a **multipÃ¡gina** condicionada por **BR-002**.

### 2.2 Clases y caracterÃ­sticas de usuarios

**Usuarios primarios**: Gerencias de Planta/Mantenimiento; IngenierÃ­a de Procesos; CoordinaciÃ³n Operativa.
**Necesidades**: reducciÃ³n del consumo energÃ©tico por unidad producida; mejora de disponibilidad y rendimiento; soporte experto para interpretaciÃ³n de datos.
**Accesibilidad/UX**: navegaciÃ³n simple, llamadas a la acciÃ³n visibles, lenguaje tÃ©cnico claro y conciso.

### 2.3 Suposiciones y dependencias

* Se cuenta con **PowerMeter** como proveedor de hardware IoT (analizador de redes elÃ©ctricas y controlador/Automate).
* Las empresas objetivo disponen de **conectividad bÃ¡sica** y personal capaz de interactuar por WhatsApp.
* En esta fase **no se recolectan datos personales** mediante formularios; el contacto se canaliza por **WhatsApp**.

### 2.4 Restricciones

* **Fase 1 sin formularios ni login**: el sitio no recolecta PII; todo contacto es vÃ­a **WhatsApp**.
* **MediciÃ³n de conversiones sÃ³lo por clic** (sin identificar personas).
* **Contenido**: landing de **una sola pÃ¡gina**; escalar a multipÃ¡gina sujeto a **BR-002**.
* **Legal/comunicacional**: publicar **casos de Ã©xito sÃ³lo con autorizaciÃ³n** (ver **BR-003**).
* **Seguridad**: navegaciÃ³n **exclusivamente por HTTPS**.
* **Alcance**: **sin** pasarelas de pago ni cotizaciones online en esta fase.

### 2.5 Ambiente operativo

* **Dispositivos**: mÃ³vil, tablet y escritorio.
* **Navegadores**: Ãºltimas 2 versiones estables de Chrome, Edge, Firefox, Safari.
* **Rendimiento de referencia**: en conexiÃ³n mÃ³vil tÃ­pica (â‰¥ 4G) debe cumplirse **NFR-031**.

## 3. Interfaces externas

> **ConvenciÃ³n de IDs**: `INT-###`.

### 3.1 Interfaz de usuario (UI)

* **CTA persistente**: botÃ³n **flotante de WhatsApp** en esquina inferior derecha con mensaje prellenado: *"Vengo de la pÃ¡gina web, quiero mÃ¡s informaciÃ³n."* (FR-001).

* **SecciÃ³n â€œServiciosâ€** con dos sub-secciones: (a) **InstalaciÃ³n** de dispositivos de toma de datos elÃ©ctricos/producciÃ³n; (b) **ConsultorÃ­a** para interpretaciÃ³n de datos y propuesta de mejoras (FR-002).

* **Texto introductorio** sobre el enfoque geogrÃ¡fico (GBA Norte) y sectorial (grÃ¡fico/cooperativas), sin exclusiones (FR-004).


* Cumplimiento de **accesibilidad** y **responsividad** segÃºn NFR-030.

* **SecciÃ³n â€œCasos de Ã©xitoâ€ (opcional, sujeta a BR-003..BR-006)**: si existen autorizaciones vÃ¡lidas, se publica una secciÃ³n con 1â€“3 casos resumidos (antes/despuÃ©s, mÃ©tricas y breve testimonio). Si no hay autorizaciones, se mostrarÃ¡ un **â€œCaso anÃ³nimoâ€** sin logos/fotos.

### 3.2 Interfaces de hardware

**No aplica en Fase 1**. El sitio no interactÃºa con hardware; las menciones a equipos IoT son **comerciales** (descriptivas).

### 3.3 Interfaces de software (APIs/SDKs)

* **INT-MET-001 â€” MediciÃ³n de conversiones**: el sistema debe permitir etiquetar y contar clics en CTA de WhatsApp como **conversiones** agregadas, sin PII.
* **INT-WA-001 â€” CTA WhatsApp**: deep-link con mensaje prellenado: *"Vengo de la pÃ¡gina web, quiero mÃ¡s informaciÃ³n."*

### 3.4 Interfaces de comunicaciÃ³n

* **Protocolo**: **HTTPS only** (TLS 1.2+).

## 4. Requisitos funcionales

> **ConvenciÃ³n de IDs**: `FR-###`. Un requisito = una necesidad verificable.

### 4.1 Estructura de requisito (plantilla)

**ID:** FR-000
**TÃ­tulo:** [verbo en infinitivo + objeto]
**DescripciÃ³n:** [quÃ© + por quÃ© + valor para el usuario/negocio].
**Actores/roles:** [quiÃ©nes interactÃºan]
**Disparadores:** [evento/Gatillo]
**Precondiciones:** [estado previo necesario]
**Flujo principal:** [pasos numerados]
**Flujos alternativos/excepciones:** [lista]
**Datos involucrados:** [entidades/atributos relevantes]
**Criterios de aceptaciÃ³n (GIVEN-WHEN-THEN):**

* GIVEN [...], WHEN [...], THEN [...].
  **Reglas de negocio aplicables:** [IDs BR-###]
  **Prioridad (MoSCoW):** [Must/Should/Could/Wonâ€™t]
  **Fuente:** [stakeholder/documento]
  **MÃ©todo de verificaciÃ³n:** [InspecciÃ³n/Prueba/DemostraciÃ³n/AnÃ¡lisis]
  **Riesgos asociados:** [breve]
  **Notas:** [opcionales]

#### Ejemplos de Criterios de AceptaciÃ³n (GWT)

**FR-001 â€” BotÃ³n WhatsApp**

* **GIVEN** estoy en cualquier secciÃ³n de la pÃ¡gina
  **WHEN** hago clic en el botÃ³n flotante
  **THEN** se abre WhatsApp con el mensaje *"Vengo de la pÃ¡gina web, quiero mÃ¡s informaciÃ³n."*
  **AND** se registra 1 conversiÃ³n de tipo **WhatsApp Click**.

**FR-002 â€” SecciÃ³n de Servicios**

* **GIVEN** un visitante accede a la pÃ¡gina
  **WHEN** navega a la secciÃ³n "Servicios"
  **THEN** visualiza **dos sub-secciones**: InstalaciÃ³n (dispositivos de toma de datos elÃ©ctricos/producciÃ³n) y ConsultorÃ­a (interpretaciÃ³n/mejoras), cada una con **alcance y beneficios** descritos en lenguaje claro.
* **GIVEN** un visitante estÃ¡ en la secciÃ³n "Servicios"
  **WHEN** recorre cada sub-secciÃ³n
  **THEN** encuentra **llamadas a la acciÃ³n** hacia el **CTA WhatsApp**.

**FR-003 â€” Escalabilidad de contenidos**

* **GIVEN** el contenido supera el umbral definido (â‰¥ 3 servicios **o** â‰¥ 800 palabras por servicio **o** â‰¥ 3 piezas educativas publicadas en 60 dÃ­as)
  **WHEN** el modo multipÃ¡gina/pestaÃ±as es **habilitado** como evoluciÃ³n
  **THEN** la navegaciÃ³n presenta **pestaÃ±as/landings por servicio** y **migas de pan/menÃº** actualizados, preservando accesibilidad y trazabilidad de contenidos.
* **GIVEN** el contenido **no** supera el umbral
  **WHEN** se mantiene el modo de **una sola pÃ¡gina**
  **THEN** la secciÃ³n "Servicios" continÃºa integrada y accesible sin pÃ©rdida de informaciÃ³n.

**FR-004 â€” Enfoque geogrÃ¡fico/sectorial**

* **GIVEN** un visitante accede a la pÃ¡gina
  **WHEN** lee el texto introductorio
  **THEN** queda explÃ­cita la **preferencia** por industrias del **GBA Norte** y **sector grÃ¡fico/cooperativas**, **sin exclusiÃ³n** de otros clientes.
* **GIVEN** el contenido introductorio
  **WHEN** se revisa el lenguaje
  **THEN** **no** debe sugerir **restricciÃ³n** o trato discriminatorio a otras industrias/regiones.

**FR-006 â€” MediciÃ³n de conversiones**

* **GIVEN** un visitante hace clic en el botÃ³n WhatsApp
  **WHEN** el evento se dispara
  **THEN** el sistema incrementa el contador de conversiones **WhatsApp Click**.

**FR-007 â€” Casos de Ã©xito (opcional)**

* **GIVEN** existe **autorizaciÃ³n escrita** para publicar un caso
  **WHEN** se habilita la secciÃ³n "Casos de Ã©xito"
  **THEN** se muestra al menos 1 caso con: contexto, objetivo, intervenciÃ³n, **mÃ©tricas antes/despuÃ©s** y nota de autorizaciÃ³n (sin PII no autorizada).
* **GIVEN** no hay autorizaciones vÃ¡lidas
  **WHEN** se evalÃºa publicar
  **THEN** se publica un **Caso anÃ³nimo** (sin logos/fotos) **o** se oculta la secciÃ³n.

**Microcopy (Home)**

* **GIVEN** el sitio en vista **mÃ³vil 360Ã—800**
  **WHEN** cargo la landing
  **THEN** el **H1**, el **H2** y el **CTA WhatsApp** son visibles **sin scroll**.
* **GIVEN** el hÃ©roe
  **WHEN** se valida la longitud
  **THEN** el **lead** tiene **â‰¤ 200 caracteres** y los **beneficios** son **3 bullets** claros.
* **GIVEN** el CTA WhatsApp
  **WHEN** se abre el enlace
  **THEN** el mensaje prellenado coincide con *"Vengo de la pÃ¡gina web, quiero mÃ¡s informaciÃ³n."*.

### 4.2 Lista inicial de requisitos

* **FR-001 â€” BotÃ³n de WhatsApp flotante**: La pÃ¡gina muestra un botÃ³n fijo abajo a la derecha con el mensaje prellenado *"Vengo de la pÃ¡gina web, quiero mÃ¡s informaciÃ³n."*. Se contabilizan los clics como conversiones.
* **FR-002 â€” SecciÃ³n de Servicios**: Se incluye una secciÃ³n con dos sub-secciones (InstalaciÃ³n de dispositivos de toma de datos elÃ©ctricos/producciÃ³n; ConsultorÃ­a para interpretaciÃ³n y mejoras) con descripciones claras de alcance y beneficios.
* **FR-003 â€” Escalabilidad de contenidos**: Al superar un umbral de contenido (p. ej., >2 servicios activos o >800 palabras por servicio), el sitio podrÃ¡ evolucionar a **pÃ¡ginas/secciones dedicadas** (pestaÃ±as/landing por servicio) manteniendo navegaciÃ³n clara.
* **FR-004 â€” Enfoque geogrÃ¡fico/sectorial**: Se muestra un texto introductorio que explicita la preferencia por **industrias del GBA Norte** y **sector grÃ¡fico/cooperativas**, sin carÃ¡cter excluyente.
* **FR-006 â€” MediciÃ³n de conversiones**: El sistema registra la cantidad de clics en el botÃ³n de WhatsApp como **conversiones** para anÃ¡lisis posterior.
* **FR-007 â€” Casos de Ã©xito (opcional)**: Si existen **autorizaciones vÃ¡lidas**, el sitio muestra una secciÃ³n con 1â€“3 casos con **mÃ©tricas antes/despuÃ©s**. Si no, se muestra un **Caso anÃ³nimo** o se omite la secciÃ³n (ver BR-003..BR-006).

## 5. Requisitos de datos

> **ConvenciÃ³n de IDs**: `D-###`.

### 5.1 Modelo de datos

**No aplica en Fase 1.** El sitio no persiste datos propios ni recolecta PII; sÃ³lo se contabilizan mÃ©tricas de clics.

### 5.2 Diccionario de datos (plantilla)

**Fase 1:** No se recolectan datos personales ni se gestionan entidades persistentes desde el sitio. Mantener esta **plantilla** para fases futuras.

| ID | Entidad | Atributo | Tipo | Dominio/ValidaciÃ³n | Nulo | DescripciÃ³n |
| -- | ------- | -------- | ---- | ------------------ | ---- | ----------- |
| â€”  | â€”       | â€”        | â€”    | â€”                  | â€”    | â€”           |

### 5.3 RetenciÃ³n y ciclo de vida

**Fase inicial**: El sitio **no almacena datos personales**; las interacciones se realizan vÃ­a WhatsApp. SÃ³lo se registran **mÃ©tricas agregadas de conversiÃ³n** (clics). Si en fases futuras se incorporan formularios, se definirÃ¡ la polÃ­tica de retenciÃ³n/anonimizaciÃ³n correspondiente.

## 6. Requisitos no funcionales

> **ConvenciÃ³n de IDs**: `NFR-###`. Referenciar ISO 25010 cuando aplique.

### 6.1 Rendimiento y escalabilidad

* **NFR-031**: La **pÃ¡gina debe cargar en â‰¤ 3 segundos** (p95) en conexiÃ³n mÃ³vil tÃ­pica (â‰¥4G), minimizando recursos bloqueantes y tamaÃ±o de carga.
* **NFR-032**: **Core Web Vitals** en home: **LCP â‰¤ 2.5 s**, **INP â‰¤ 200 ms**, **CLS â‰¤ 0.1**.

> Nota: NFR-001/002 reservados para Fase 2 (si se aÃ±ade backend/API).

### 6.2 Disponibilidad y continuidad

* NFR-010: [SLA 99.9% mensual].
* NFR-011: [RPO 15 min, RTO 30 min].

### 6.3 Seguridad

* **NFR-021**: El sitio debe operar **exclusivamente bajo HTTPS** con **certificado SSL/TLS vÃ¡lido (TLS 1.2+)** para proteger la comunicaciÃ³n.
* **NFR-022**: Alineamiento con **OWASP ASVS** en controles bÃ¡sicos de despliegue (cabeceras de seguridad, no exposiciÃ³n de secretos). *Controles de autenticaciÃ³n/autorizaciÃ³n aplicarÃ¡n en Fase 2 si se incorporan formularios/login.*

### 6.4 Usabilidad y accesibilidad

* **NFR-030**: Cumplimiento de **WCAG 2.1 nivel AA**, **diseÃ±o responsivo** (mÃ³vil/tablet/escritorio) y **navegaciÃ³n clara** con CTAs visibles hacia contacto/servicios.

### 6.5 Mantenibilidad y portabilidad

* NFR-040: [Cobertura de tests â‰¥ 80%, complejidad ciclomÃ¡tica, estÃ¡ndares de cÃ³digo].
* NFR-041: [ContenerizaciÃ³n, 12-Factor, IaC].

### 6.6 Confiabilidad

* NFR-050: [MTBF/MTTR objetivos, reintentos idempotentes].

### 6.7 Cumplimiento legal y normativo

* NFR-060: [Privacidad/datos personales (indicar ley aplicable), auditorÃ­as].

## 7. Reglas de negocio

> **ConvenciÃ³n de IDs**: `BR-###`.

| ID         | Regla                             | DescripciÃ³n                                                                                                                                                            | Excepciones                                            |
| ---------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **BR-001** | DefiniciÃ³n de conversiÃ³n          | ConversiÃ³n = clic vÃ¡lido en CTA WhatsApp. Clics repetidos en <30 s cuentan 1.                                                                         | Pruebas internas/QA pueden excluirse.                  |
| **BR-002** | Escalado a multipÃ¡gina            | Si en 60 dÃ­as se cumplen â‰¥2 de: (a) â‰¥3 servicios activos, (b) â‰¥800 palabras por servicio, (c) â‰¥3 piezas educativas publicadas; se habilita sitio multipÃ¡gina/pestaÃ±as. | Periodos con <30 visitas totales no gatillan la regla. |
| **BR-003** | PublicaciÃ³n de casos              | Casos de Ã©xito requieren **autorizaciÃ³n escrita** de la empresa o del intermediario (si aplica).                                                                       | Se admite â€œCaso anÃ³nimoâ€ sin marcas ni fotos.          |
| **BR-004** | Derechos de uso de imagen y marca | Logos, fotos de instalaciones y citas textuales requieren permiso explÃ­cito con alcance (canales y plazo).                                                             | En ausencia, usar imÃ¡genes genÃ©ricas o anonimizar.     |
| **BR-005** | AnonimizaciÃ³n por defecto         | Si falta algÃºn permiso, se **anonimiza**: sin logos, sin fotos identificables, sin PII.                                                                                | Puede revertirse al obtener autorizaciÃ³n.              |
| **BR-006** | RevisiÃ³n previa del cliente       | Todo caso publicado debe ser **revisado y aprobado** por el cliente/intermediario.                                                                                     | N/A                                                    |

## 8. Casos de uso (opcional pero recomendado)

**UC-01 â€” Iniciar contacto por WhatsApp**
**Actores:** Visitante (Primario); Sitio Web (Secundario); Plataforma WhatsApp (Sistema externo).
**Objetivo:** Contactar a profebustos por WhatsApp desde el CTA.
**Precondiciones:** Landing cargada; CTA visible; conectividad disponible.
**Escenario principal:** 1) Visitante ve CTA; 2) Hace clic; 3) Se abre WhatsApp/App o Web con mensaje prellenado; 4) Se registra conversiÃ³n **WhatsApp Click**.
**Extensiones/Excepciones:**

* **E1 (Sin app WhatsApp):** abrir **WhatsApp Web** en nueva pestaÃ±a; si falla, mostrar nÃºmero y botÃ³n **â€œCopiar nÃºmeroâ€**.
* **E2 (Bloqueo de pop-up):** mostrar mensaje con enlace alternativo **â€œAbrir WhatsAppâ€**.
* **E3 (CancelaciÃ³n por el usuario):** la conversiÃ³n se mantiene contada por evento de clic (ver BR-001/FR-006).
  **Pre/Postcondiciones:** Tras el clic exitoso, queda 1 conversiÃ³n registrada para anÃ¡lisis.
  **Requisitos enlazados:** FR-001, FR-006, INT-WA-001.

## 9. Historias de usuario (si se usa enfoque Ã¡gil)

**ID:** US-###
**Como** [rol] **quiero** [capacidad] **para** [beneficio].
**Criterios de aceptaciÃ³n (GWT):** [lista]
**DefiniciÃ³n de Ready/Done:** [checklist].

## 10. Requisitos de integraciÃ³n y despliegue

### 10.1 IntegraciÃ³n (alto nivel, agnÃ³stico de tecnologÃ­a)

* **I-001 â€” MediciÃ³n de conversiones:** Debe existir un mecanismo para etiquetar y contar clics en CTA WhatsApp como **conversiones agregadas** (sin PII). Debe poder segmentarse por pÃ¡gina/secciÃ³n y rango temporal.
* **I-003 â€” Aviso legal y cookies (si aplica):** Si se incorpora rastreo adicional en futuras fases, se deberÃ¡ mostrar aviso/captura de consentimiento acorde a norma vigente.

### 10.2 Despliegue (alineado a NFR y reglas)

* **D-001 â€” HTTPS only:** Certificado SSL/TLS **vÃ¡lido** y renovado automÃ¡ticamente; redirecciÃ³n **301** de HTTPâ†’HTTPS.
* **D-003 â€” Rendimiento inicial:** Tiempo de carga **â‰¤ 3 s p95** (ver NFR-031) bajo conexiÃ³n mÃ³vil tÃ­pica (â‰¥4G); tamaÃ±o total de recursos inicial **objetivo â‰¤ 1.0 MB** (orientativo, no vinculante).
* **D-004 â€” Observabilidad mÃ­nima:** Logs de acceso/errores de servidor y tableros de **conversiÃ³n** (WhatsApp Click) por dÃ­a/semana/mes.
* **D-005 â€” Contenido y cambios:** Flujo de publicaciÃ³n con revisiÃ³n (4 ojos). Al publicar nuevos **servicios** o **piezas educativas**, evaluar **BR-002** para escalar a multipÃ¡gina.
* **D-006 â€” Backup/rollback:** Copia de seguridad previa a releases mayores y punto de retorno documentado.
* **D-007 â€” Robots y metadatos:** `robots.txt` y metaetiquetas para indexaciÃ³n adecuada; sitemap cuando exista multipÃ¡gina.
* **D-008 â€” AuditorÃ­a de performance:** RevisiÃ³n **trimestral** de **Core Web Vitals** y **PageSpeed**; acciones correctivas si no se cumplen **NFR-031/NFR-032**.

### 10.3 Criterios de aceptaciÃ³n de despliegue

* **GIVEN** el sitio estÃ¡ en producciÃ³n **WHEN** se audita el acceso **THEN** todas las rutas responden por **HTTPS** y redirigen correctamente desde HTTP.
* **GIVEN** el panel de mÃ©tricas **WHEN** se ejecutan clics de prueba **THEN** se reflejan incrementos en **WhatsApp Click** el mismo dÃ­a.
* **GIVEN** una conexiÃ³n â‰¥4G **WHEN** se carga la landing **THEN** el p95 de carga es â‰¤ 3 s.

## 11. GestiÃ³n de riesgos

| ID       | Riesgo                                      | Impacto | Prob. | MitigaciÃ³n                           | Contingencia                                    |
| -------- | ------------------------------------------- | ------- | ----- | ------------------------------------ | ----------------------------------------------- |
| **R-01** | Baja tasa de conversiÃ³n                     | Medio   | M     | CTA visible, copy claro, pruebas A/B | Ajustar copy/posiciÃ³n del CTA                   |
| **R-02** | Dependencia PowerMeter                      | Alto    | M     | Plan alternativo de proveedor        | Ofrecer servicios compatibles con otros equipos |
| **R-03** | Conflicto en uso de casos con intermediario | Medio   | M     | BR-003 (autorizaciÃ³n)                | Usar casos anÃ³nimos                             |

## 12. AceptaciÃ³n y criterios de validaciÃ³n

* **Ã‰xito inicial (60 dÃ­as)**: al menos **N (TBD)** conversiones totales (WhatsApp) y tiempo de carga â‰¤ 3 s p95 (**NFR-031**).
* **Accesibilidad**: WCAG 2.1 AA verificada por checklist y revisiÃ³n manual (**NFR-030**).
* **Seguridad**: navegaciÃ³n HTTPS validada con certificado SSL/TLS vigente (**NFR-021**).
* **Contenido de Servicios**: cada sub-secciÃ³n (InstalaciÃ³n, ConsultorÃ­a) presenta **â‰¥ 120 palabras**, beneficios explÃ­citos, alcance y CTA visibles.
* **Microcopy (Home)**: **H1/H2/CTA** visibles sin scroll en 360Ã—800; **lead â‰¤ 200 caracteres**; **3 bullets**; mensaje prellenado de WhatsApp correcto.
* **Casos de Ã©xito**: publicaciÃ³n condicionada a **autorizaciÃ³n escrita**; presencia de **mÃ©tricas antes/despuÃ©s**; opciÃ³n **Caso anÃ³nimo** si falta permiso (ver BR-003..BR-006).

## 13. Matriz de trazabilidad (requisitos â†” origen â†” pruebas â†” despliegue) (requisitos â†” origen â†” pruebas â†” despliegue)

| Req ID | Fuente               | Caso de uso/Historia | Caso(s) de prueba            | Componente/MÃ³dulo                        | Estado    |
| ------ | -------------------- | -------------------- | ---------------------------- | ---------------------------------------- | --------- |
| FR-001 | Stakeholder: AgustÃ­n | UC-01                | TC-001 (GWT)                 | UI â€“ CTA                                 | Pendiente |
| FR-002 | Stakeholder: AgustÃ­n | â€”                    | TC-004 (secciÃ³n servicios)   | Contenidos                               | Pendiente |
| FR-003 | Stakeholder: AgustÃ­n | â€”                    | TC-005 (umbral y navegaciÃ³n) | Arquitectura de informaciÃ³n / NavegaciÃ³n | Pendiente |
| FR-004 | Stakeholder: AgustÃ­n | â€”                    | TC-006 (texto introductorio) | Contenidos                               | Pendiente |
| FR-006 | Stakeholder: AgustÃ­n | UC-01/UC-02          | TC-003 (evento conteo)       | MÃ©tricas                                 | Pendiente |
| FR-007 | Stakeholder: AgustÃ­n | â€”                    | TC-008 (publicaciÃ³n caso)    | Contenidos                               | Pendiente |

### 13.1 Matriz FR â†” BR â†” TC (consistencia de reglas y pruebas)

| FR                                    | Reglas de negocio (BR)              | Casos de prueba (TC) |
| ------------------------------------- | ----------------------------------- | -------------------- |
| FR-001 â€” BotÃ³n WhatsApp               | BR-001                              | TC-001               |
| FR-002 â€” SecciÃ³n Servicios            | â€”                                   | TC-004               |
| FR-003 â€” Escalabilidad de contenidos  | BR-002                              | TC-005               |
| FR-004 â€” Enfoque geogrÃ¡fico/sectorial | â€”                                   | TC-006               |
| FR-006 â€” MediciÃ³n de conversiones     | BR-001                              | TC-003               |
| FR-007 â€” Casos de Ã©xito               | BR-003, BR-004, BR-005, BR-006      | TC-008               |

> **Chequeo rÃ¡pido de consistencia**: Cada FR tiene CA (GWT) y al menos un TC asociado. Las reglas BR estÃ¡n mapeadas donde aplican (conversiÃ³n, escalado y polÃ­tica de casos). Si se agregan nuevos FR, actualizar ambas matrices y la secciÃ³n 12.

## 14. Anexos

### 14.1 GuÃ­a de calidad de requisitos (checklist)

* **UnÃ­voco** (no ambiguo, un solo significado)
* **Verificable** (prueba/inspecciÃ³n posible)
* **Necesario y valioso** (orientado a negocio/usuario)
* **Trazable** (FR â†” BR â†” TC enlazados)
* **AtÃ³mico** (una necesidad por FR)
* **Independiente** (evitar solapamientos)
* **No prescriptivo de implementaciÃ³n** (quÃ©, no cÃ³mo)
* **Consistente** con NFR y reglas
* **Versionado** (control de cambios actualizado)

### 14.2 Plantillas reutilizables

**A. Caso de prueba (TC-###)**

* **Precondiciones:** [ ]
* **Pasos:** [1..n]
* **Resultado esperado:** [ ]
* **Datos de prueba:** [ ]
* **Severidad/Prioridad:** [ ]

**B. Endpoint REST (ejemplo)** *(plantilla â€” no aplica en Fase 1; conservar para Fase 2)*

* **ID:** INT-API-###
* **Ruta/Verbo:** `GET /v1/recurso`
* **Auth:** [p. ej., Bearer JWT, scope X]
* **Request:** [parÃ¡metros/headers]
* **Responses:** [200, 4xx, 5xx con esquemas]
* **Errores estÃ¡ndar:** [cÃ³digos/mensajes]

**C. MÃ©trica/SLO**

* **Nombre:** [ ]

* **DefiniciÃ³n formal:** [ ]

* **Objetivo:** [ ]

* **Fuente de datos:** [ ]

* **VisualizaciÃ³n:** [tablero/alertas]*

* **Nombre:** [ ]

* **DefiniciÃ³n formal:** [ ]

* **Objetivo:** [ ]

* **Fuente de datos:** [ ]

* **VisualizaciÃ³n:** [tablero/alertas]

### 14.3 Casos de prueba instanciados

**TC-001 â€” WhatsApp Click (FR-001)**

* **Precondiciones:** Landing cargada, CTA visible.
* **Pasos:** 1) Hacer clic en CTA; 2) Verificar apertura de WhatsApp con mensaje; 3) Verificar registro de conversiÃ³n.
* **Resultado esperado:** WhatsApp se abre con mensaje prellenado y se registra 1 conversiÃ³n **WhatsApp Click**.

**TC-003 â€” Conteo de conversiones (FR-006)**

* **Precondiciones:** Sistema de mediciÃ³n habilitado.
* **Pasos:** 1) Ejecutar clic en CTA WhatsApp; 2) Revisar mÃ©tricas.
* **Resultado esperado:** Incrementos en contadores **WhatsApp Click** sin PII.

**TC-004 â€” SecciÃ³n Servicios (FR-002)**

* **Precondiciones:** Landing cargada.
* **Pasos:** 1) Desplazarse a â€œServiciosâ€; 2) Validar presencia de sub-secciones InstalaciÃ³n y ConsultorÃ­a; 3) Verificar descripciÃ³n de alcance y beneficios; 4) Verificar CTAs presentes; 5) Verificar longitud â‰¥ 120 palabras por sub-secciÃ³n.
* **Resultado esperado:** Se muestran ambas sub-secciones con textos claros, CTAs a contacto y longitud mÃ­nima cumplida.

**TC-005 â€” Escalabilidad (FR-003)**

* **Precondiciones:** Contenidos que superen umbral (simulaciÃ³n o entorno de prueba).
* **Pasos:** 1) Habilitar modo multipÃ¡gina/pestaÃ±as; 2) Verificar navegaciÃ³n por pestaÃ±as/landings; 3) Verificar migas/menÃº.
* **Resultado esperado:** La navegaciÃ³n multipÃ¡gina se activa correctamente y mantiene accesibilidad.

**TC-006 â€” Intro geogrÃ¡fico/sectorial (FR-004)**

* **Precondiciones:** Landing cargada.
* **Pasos:** 1) Revisar texto introductorio; 2) Validar que menciona preferencia GBA Norte/sector grÃ¡fico/cooperativas; 3) Validar claridad de **no exclusiÃ³n**.
* **Resultado esperado:** El texto refleja preferencia sin excluir a otros clientes.

**TC-007 â€” Microcopy (Home)**

* **Precondiciones:** Landing en vista mÃ³vil 360Ã—800.
* **Pasos:** 1) Cargar la landing; 2) Verificar visibilidad sin scroll de H1/H2/CTA; 3) Contar caracteres del lead; 4) Contar bullets de beneficios; 5) Clic en CTA y validar mensaje prellenado.
* **Resultado esperado:** Se cumplen visibilidad, longitud y contenido del CTA.

**TC-008 â€” PublicaciÃ³n de caso de Ã©xito (FR-007)**

* **Precondiciones:** Permisos/autorizaciones documentadas.
* **Pasos:** 1) Cargar secciÃ³n; 2) Verificar presencia de contexto, objetivo, intervenciÃ³n y mÃ©tricas antes/despuÃ©s; 3) Verificar nota de autorizaciÃ³n o anonimizaciÃ³n.
* **Resultado esperado:** Caso publicado conforme a BR-003..BR-006.

### 14.4 Borradores de textos comerciales (para publicaciÃ³n)

> Contenido de ejemplo para la secciÃ³n **Servicios** (se puede adaptar en tono y extensiÃ³n). No implica compromisos comerciales hasta su aprobaciÃ³n.

**A. InstalaciÃ³n de medidores y captura de datos industriales**
**SubtÃ­tulo propuesto:** LÃ­nea base energÃ©tica y productiva en semanas, no meses.
**Alcance (quÃ© incluye):** relevamiento in situ; instalaciÃ³n de medidores y puntos de captura de producciÃ³n; verificaciÃ³n de seÃ±ales; puesta en marcha y validaciÃ³n de lecturas; documentaciÃ³n bÃ¡sica de mediciÃ³n (mapa de puntos, checklist); handover operativo.
**Beneficios esperados:** visibilidad del **kWh por unidad producida**; detecciÃ³n de pÃ©rdidas de disponibilidad; preparaciÃ³n para mejoras en rendimiento; base para comparar turnos/proveedores/formato.
**Entregables:** plan de mediciÃ³n, informe breve de puesta en marcha, recomendaciones iniciales para estabilizar la lÃ­nea base.
**Diferenciales:** experiencia en industrias del GBA Norte (preferencia por sector grÃ¡fico/cooperativas) y trabajo con dispositivos IoT de **PowerMeter**.
**CTA sugerido:** *â€œHablemos por WhatsApp: contame tu lÃ­nea y vemos juntos el plan de mediciÃ³n inicial.â€*

**B. ConsultorÃ­a en interpretaciÃ³n de datos y mejora de indicadores**
**SubtÃ­tulo propuesto:** De datos a decisiones: eficiencia energÃ©tica y OEE (Disponibilidad y Rendimiento).
**Alcance (quÃ© incluye):** anÃ¡lisis de **lÃ­nea base** (energÃ­a/unidad, disponibilidad, rendimiento); identificaciÃ³n de desvÃ­os; priorizaciÃ³n de oportunidades; plan de mejora por impacto/esfuerzo; seguimiento opcional de resultados.
**Beneficios esperados:** reducciÃ³n del consumo **por unidad**; mejora de **disponibilidad** y **rendimiento**; decisiones con evidencia y foco en retorno.
**Entregables:** **informe ejecutivo** con hallazgos y plan priorizado; guÃ­a breve para continuidad operativa.
**Diferenciales:** enfoque pragmÃ¡tico orientado a planta; experiencia docente para explicar y alinear equipos.
**CTA sugerido:** *â€œÂ¿QuerÃ©s entender dÃ³nde se va la energÃ­a y el tiempo? Escribime por WhatsApp y lo vemos.â€*

**Nota legal/comunicacional:** la publicaciÃ³n de **casos de Ã©xito** y/o imÃ¡genes requiere autorizaciÃ³n previa (ver **BR-003**).

### 14.5 Microcopy final (Home)

> Pieza concisa para la landing. Tonalidad: tÃ©cnicoâ€‘clara, orientaciÃ³n industrial.

**H1 (TÃ­tulo principal):** Eficiencia energÃ©tica y OEE para industrias del GBA Norte
**H2 (SubtÃ­tulo):** InstalaciÃ³n de medidores + consultorÃ­a para interpretar datos de energÃ­a y producciÃ³n
**Lead (hÃ©roe, 1â€“2 lÃ­neas):** Medimos **kWh por unidad** y **disponibilidad/rendimiento** para construir tu **lÃ­nea base** y priorizar mejoras con retorno. Empezamos simple: visibilidad, foco y resultados.

**Beneficios (bullets cortos):**

* LÃ­nea base en semanas, no meses.
* Decisiones con datos: energÃ­a/unidad, disponibilidad y rendimiento.
* Preferencia sector grÃ¡fico y cooperativas (sin exclusiones).

**CTA primario:** **Escribime por WhatsApp**
Texto del mensaje prellenado: *"Vengo de la pÃ¡gina web, quiero mÃ¡s informaciÃ³n."*

**SecciÃ³n Servicios (microcopys):**

* **InstalaciÃ³n de medidores** â€” Relevamiento, instalaciÃ³n y puesta en marcha para capturar energÃ­a y producciÃ³n con lecturas confiables.
* **ConsultorÃ­a** â€” Interpretamos los datos, definimos lÃ­nea base y priorizamos mejoras en **energÃ­a/unidad**, **disponibilidad** y **rendimiento**.

**Disclaimer breve:** Sin formularios en esta fase: el contacto es por **WhatsApp**. Casos de Ã©xito publicados **solo** con autorizaciÃ³n.

### 14.6 Plantilla de Caso de Ã‰xito y Checklist de autorizaciÃ³n

**Plantilla de Caso de Ã‰xito**

* **TÃ­tulo del caso**
* **Empresa/sector** [o **Caso anÃ³nimo**]
* **Contexto** (lÃ­nea/turno, formato, problema)
* **Objetivo** (quÃ© se buscÃ³ mejorar)
* **IntervenciÃ³n** (instalaciÃ³n/consultorÃ­a)
* **MÃ©tricas antes/despuÃ©s** (kWh/unidad; disponibilidad; rendimiento)
* **Resultados y prÃ³ximos pasos**
* **AutorizaciÃ³n** (referencia/ID del permiso)
* **Medios** (opcional: foto genÃ©rica o sin imagen)

**Checklist de autorizaciÃ³n (BR-003..BR-006)**

* [ ] Permiso escrito del cliente/intermediario.
* [ ] Alcance de uso (web/redes), plazo y revocaciÃ³n.
* [ ] Derechos de marca/imagen y restricciones.
* [ ] AnonimizaciÃ³n aplicada si faltan permisos.
* [ ] RevisiÃ³n y aprobaciÃ³n final del cliente/intermediario.

### 14.7 Activos Google Ads (borrador operativo)

> **Nota:** Se incluyen versiones **compatibles** (â‰¤90 caracteres) y **extendidas** (91â€“120) para descripciones. Titulares con **â‰¤30** caracteres. Ajustar a la plataforma elegida.

**Titulares (â‰¤30 caracteres)**

1. Eficiencia y OEE Industrial
2. Medimos kWh por Unidad
3. MejorÃ¡ Disponibilidad y Rend.

**Descripciones â€” Compatibles (â‰¤90)**
A. InstalaciÃ³n de medidores + consultorÃ­a. MedÃ­ kWh/unidad y mejorÃ¡ disponibilidad y rendimiento.
B. LÃ­nea base en semanas. Datos claros para reducir energÃ­a por unidad y subir OEE.
C. Preferencia GBA Norte y sector grÃ¡fico. Contacto simple por WhatsApp.

**Descripciones â€” Extendidas (91â€“120)**
A+. MediciÃ³n y consultorÃ­a para construir tu lÃ­nea base: kWh/unidad, disponibilidad y rendimiento con foco en retorno.
B+. Instalamos medidores y analizamos datos para bajar energÃ­a/unidad y mejorar disponibilidad/rendimiento.
C+. Enfocados en industrias del GBA Norte y cooperativas. Contacto inmediato por WhatsApp.

**Sugerencias de paths**

* `profebustos.com.ar/industria`
* `profebustos.com.ar/eficiencia`
* `profebustos.com.ar/oee`

**UTM (opcional para trazado)**

* `?utm_source=google&utm_medium=cpc&utm_campaign=aw_landing&utm_content=cta_whatsapp`

**PolÃ­tica de conversiÃ³n (ads)**

* Medir como conversiÃ³n los clics en CTA WhatsApp (ver FR-006; BR-001).

