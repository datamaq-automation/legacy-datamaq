/*
Path: src/infrastructure/content/content.ts
*/

import type { AppContent, CommercialConfig } from '@/domain/types/content'
import analyticsDashboard from '@/assets/analytics-dashboard.svg'
import heroIllustration from '@/assets/hero-energy.svg'
import installTools from '@/assets/install-tools.svg'
import powermeter from '@/assets/powermeter.svg'
import teamTraining from '@/assets/team-training.svg'


export const commercialConfig: CommercialConfig = {
  baseOperativa: 'Garín (GBA Norte)', // base prioritaria
  tarifaBaseDesdeARS: 180000, // instalación típica 1 Powermeter (equipo provisto por el cliente)
  trasladoMinimoARS: 0, // si querés publicar mínimo, setear valor (ej. 25000)
  // Tarifa base publicada para automatización comercial (setup / implementación mínima).
  // Ajustá estos valores según tu estrategia comercial.
  tarifaChatwootDesdeARS: 260000,
  tarifaRasaDesdeARS: 320000,
  descuentos: {
    cooperativasPct: 0,
    pymeGraficaPct: 0
  },
  equipos: {
    medidorNombre: 'Powermeter',
    automateNombre: 'Automate'
  },
  software: {
    chatwootNombre: 'Chatwoot',
    rasaNombre: 'Rasa'
  }
}

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value)

const TARIFA_BASE = formatARS(commercialConfig.tarifaBaseDesdeARS)
const TARIFA_CHATWOOT = formatARS(commercialConfig.tarifaChatwootDesdeARS)
const TARIFA_RASA = formatARS(commercialConfig.tarifaRasaDesdeARS)

const BASE = commercialConfig.baseOperativa
const POWERMETER = commercialConfig.equipos.medidorNombre
const AUTOMATE = commercialConfig.equipos.automateNombre

const CHATWOOT = commercialConfig.software.chatwootNombre
const RASA = commercialConfig.software.rasaNombre

const HAS_TRASLADO_MIN = commercialConfig.trasladoMinimoARS > 0
const TRASLADO_MIN = HAS_TRASLADO_MIN ? formatARS(commercialConfig.trasladoMinimoARS) : ''
const TRASLADO_TEXT = HAS_TRASLADO_MIN ? ` (mínimo ${TRASLADO_MIN})` : ''

export const content: AppContent = {
  hero: {
    badge: 'Tarifa base publicada · Respuesta en menos de 24 horas',
    title: 'Servicios industriales + automatización comercial, prolijos y documentados',
    subtitle:
      `Industrial: instalación de ${POWERMETER}/${AUTOMATE} y diagnóstico eléctrico. Comercial: implementamos ${CHATWOOT} + ${RASA} para ordenar atención, calificar consultas y derivar más rápido.`,
    responseNote:
      `En menos de 24 horas te respondemos con: tarifas base publicadas (Powermeter desde ${TARIFA_BASE}, ${CHATWOOT} desde ${TARIFA_CHATWOOT}, ${RASA} desde ${TARIFA_RASA}), traslado según distancia desde ${BASE}${TRASLADO_TEXT} (solo servicios presenciales) y próximos pasos para coordinar.`,
    chatUnavailableMessage:
      'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos, gracias por tu paciencia.',
    primaryCta: {
      label: 'Cotizar por WhatsApp',
      action: 'whatsapp'
    },
    secondaryCta: {
      label: 'Ver servicios',
      href: '#servicios'
    },
    benefits: [
      {
        title: 'Tarifas base claras',
        text: `Industrial: instalación de 1 ${POWERMETER} desde ${TARIFA_BASE}. Comercial: ${CHATWOOT} desde ${TARIFA_CHATWOOT} y ${RASA} desde ${TARIFA_RASA}.`,
        variant: 'success'
      },
      {
        title: 'Implementación documentada',
        text: 'Checklist, configuración verificable, pruebas de funcionamiento y entrega de documentación para operación y mejora.',
        variant: 'primary'
      },
      {
        title: 'Enfoque por objetivos',
        text: 'Industrial: medición/diagnóstico confiable. Comercial: ordenar atención, reducir carga manual y acelerar respuestas.',
        variant: 'warning'
      }
    ],
    image: {
      src: heroIllustration,
      alt: 'Ilustración de medición industrial y automatización',
      width: 420,
      height: 320
    }
  },

  services: {
    title: 'Servicios',
    cards: [
      {
        id: 'instalacion',
        title: `Instalación industrial de 1 ${POWERMETER} (equipo provisto por el cliente)`,
        description:
          `Relevamos el tablero, instalamos el ${POWERMETER} y dejamos la medición funcionando con una verificación de referencia. Ideal para arrancar a medir consumo y variables eléctricas con criterios de seguridad y trazabilidad.`,
        subtitle: 'Incluye',
        media: {
          src: installTools,
          alt: 'Ilustración de herramientas e instalación técnica',
          width: 140,
          height: 120
        },
        items: [
          'Relevamiento del tablero: accesibilidad, punto de instalación, protecciones y condiciones de seguridad.',
          `Instalación del ${POWERMETER} + verificación de lectura de referencia (validación básica del punto de medición).`,
          'Registro y documentación: fotos del tablero/punto de medición, checklist y observaciones relevantes.',
          'Tiempo típico: media jornada (aprox. 4 horas), según condiciones del tablero.'
        ],
        figure: {
          src: powermeter,
          alt: `Ilustración de medidor ${POWERMETER}`,
          width: 220,
          height: 140,
          caption: `Tarifa base desde ${TARIFA_BASE}. Traslado según distancia desde ${BASE}${TRASLADO_TEXT}. No vendemos el equipo: instalamos el ${POWERMETER} provisto por el cliente.`
        },
        cta: {
          label: 'Cotizar / Agendar por WhatsApp',
          action: 'whatsapp',
          section: 'servicios-instalacion'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      },

      {
        id: 'diagnostico',
        title: 'Diagnóstico y reparación de fallas eléctricas/electrónicas (industria)',
        description:
          'Diagnóstico en planta para fallas intermitentes o críticas: medición, prueba, aislamiento del problema y propuesta de reparación. Ideal cuando “la línea no puede parar” y necesitás un criterio técnico confiable.',
        subtitle: 'Resultado',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustración de diagnóstico técnico y mediciones',
          width: 160,
          height: 140
        },
        items: [
          'Diagnóstico en campo con instrumental y método (medición, hipótesis, pruebas, descarte).',
          'Identificación de causa probable y plan de reparación / corrección (inmediata o programada).',
          'Recomendaciones para prevenir recurrencia (ajustes, protecciones, orden/seguridad del tablero, etc.).'
        ],
        note:
          'Priorizamos condiciones seguras de trabajo. Si el tablero/instalación no permite intervenir con seguridad, se propone adecuación mínima y se reprograma la reparación.',
        figure: {
          src: analyticsDashboard,
          alt: 'Ilustración de mediciones y checklist',
          width: 160,
          height: 140,
          caption:
            'Servicio orientado a industria (GBA Norte prioritario). Disponibilidad extendida según agenda.'
        },
        cta: {
          label: 'Reportar falla por WhatsApp',
          action: 'whatsapp',
          section: 'servicios-diagnostico'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      },

      {
        id: 'urgencias',
        title: 'Urgencias industriales fuera de horario',
        description:
          'Atendemos casos urgentes en planta cuando hay criticidad operativa. Incluye disponibilidad extendida (sábados, domingos y feriados) según agenda.',
        subtitle: 'Incluye',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustración de atención de urgencias y diagnóstico en planta',
          width: 160,
          height: 140
        },
        items: [
          'Priorización según criticidad, seguridad y disponibilidad operativa.',
          'Intervenciones fuera de horario y fines de semana con coordinación previa.',
          'Relevamiento y plan de acción inmediato o programado según el caso.'
        ],
        note:
          'Condiciones: no se interviene si el entorno no es seguro, se agenda por prioridad y puede aplicar recargo por urgencia.',
        cta: {
          label: 'Solicitar urgencia por WhatsApp',
          action: 'whatsapp',
          section: 'servicios-urgencias'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      },

      {
        id: 'chatwoot',
        title: `Instalación y puesta en marcha de ${CHATWOOT} (automatización comercial)`,
        description:
          `Implementamos ${CHATWOOT} para centralizar WhatsApp/Telegram/webchat, ordenar la atención y dar trazabilidad (etiquetas, equipos, macros y reportes). Ideal para equipos de ventas y soporte que necesitan responder más rápido y con criterio.`,
        subtitle: 'Incluye',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustración de CRM de mensajería y flujo de atención',
          width: 160,
          height: 140
        },
        items: [
          `Instalación de ${CHATWOOT} (self-hosted en servidor del cliente o VPS administrado por nosotros) + healthcheck.`,
          'Configuración inicial: cuentas, inboxes, equipos/roles, etiquetas y macros básicas.',
          'Buenas prácticas operativas: asignación, estado de conversación y métricas mínimas.',
          'Documentación de handoff: accesos, backups básicos y checklist de operación.'
        ],
        note:
          'No incluye costo de servidor/hosting, ni integraciones avanzadas (se cotizan según alcance).',
        figure: {
          src: installTools,
          alt: 'Ilustración de instalación y configuración de herramientas',
          width: 220,
          height: 140,
          caption: `Tarifa base desde ${TARIFA_CHATWOOT}. Alcance y complejidad (canales, integraciones, infraestructura) ajustan el presupuesto final.`
        },
        cta: {
          label: `Cotizar ${CHATWOOT} por WhatsApp`,
          action: 'whatsapp',
          section: 'servicios-chatwoot'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      },

      {
        id: 'rasa',
        title: `Implementación mínima de ${RASA} (intenciones iniciales + flujo base)`,
        description:
          `Implementamos ${RASA} para automatizar preguntas frecuentes, clasificar mensajes y calificar consultas. Dejamos un bot base funcionando con intenciones iniciales, respuestas y fallback, listo para iterar con datos reales.`,
        subtitle: 'Incluye',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustración de automatización conversacional y clasificación de mensajes',
          width: 160,
          height: 140
        },
        items: [
          `Instalación y configuración de entorno de ${RASA} (self-hosted en servidor del cliente o VPS administrado por nosotros) + healthcheck.`,
          'Base conversacional mínima: intents, ejemplos, respuestas y reglas esenciales (happy path + fallback).',
          'Entrenamiento inicial y pruebas de flujo con casos típicos.',
          'Documentación para mejora continua: cómo agregar intents, ejemplos y ajustar respuestas.'
        ],
        note:
          'Integración con Chatwoot y entrenamiento avanzado se cotizan según complejidad y material disponible (FAQs, conversaciones, categorías).',
        figure: {
          src: analyticsDashboard,
          alt: 'Ilustración de flujo conversacional y métricas',
          width: 160,
          height: 140,
          caption: `Tarifa base desde ${TARIFA_RASA}. El alcance final depende de cantidad de intenciones, canales e integración requerida.`
        },
        cta: {
          label: `Cotizar ${RASA} por WhatsApp`,
          action: 'whatsapp',
          section: 'servicios-rasa'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      }
    ]
  },

  about: {
    title: 'Sobre DataMaq',
    paragraphs: [
      'DataMaq brinda servicios técnicos con dos focos: (1) industria (medición/diagnóstico) y (2) automatización comercial (atención y calificación de consultas). El objetivo es que tomes decisiones con datos reales y que tu operación quede ordenada, medible y documentada.',
      `Base operativa: ${BASE}. Cobertura presencial prioritaria GBA Norte y AMBA según disponibilidad. Servicios de software disponibles en modalidad self-hosted (servidor del cliente) o VPS administrado por DataMaq.`
    ],
    image: {
      src: teamTraining,
      alt: 'Ilustración de formación técnica y equipo de trabajo',
      width: 240,
      height: 180
    }
  },

  navbar: {
    brand: 'DataMaq',
    brandAriaLabel: 'DataMaq, inicio',
    links: [
      {
        label: 'Servicios',
        href: '#servicios'
      }
    ],
    contactLabel: 'Cotizar por WhatsApp'
  },

  footer: {
    note: `Base: ${BASE} · Industria + Automatización comercial · Implementación por objetivos · Documentación y handoff`
  },

  legal: {
    text:
      `La tarifa base publicada para Powermeter corresponde a la instalación de 1 ${POWERMETER} (equipo provisto por el cliente) y una verificación de lectura de referencia al finalizar. El traslado se cotiza según distancia desde ${BASE}${TRASLADO_TEXT}. Si el tablero/instalación requiere adecuaciones mínimas de seguridad, se informa y presupuesta antes de intervenir. Para servicios de software (Chatwoot/Rasa), el alcance, infraestructura (servidor/hosting), integraciones y nivel de implementación se definen y cotizan por separado. Las cookies de analítica (GA4 y Clarity) se habilitan únicamente tras tu consentimiento explícito.`
  },

  contact: {
    title: '¿Querés recibir una propuesta por correo?',
    subtitle:
      `Completá el formulario y te enviamos una propuesta según el servicio: Powermeter (${TARIFA_BASE}), ${CHATWOOT} (${TARIFA_CHATWOOT}) o ${RASA} (${TARIFA_RASA}). Si es urgente, el canal más rápido es WhatsApp.`,
    labels: {
      name: 'Nombre y apellido',
      email: 'Correo electrónico',
      company: 'Empresa (opcional)',
      message: 'Mensaje (opcional)'
    },
    submitLabel: 'Enviar consulta por correo',
    checkingMessage: 'Verificando la disponibilidad del servicio de correo electrónico…',
    unavailableMessage:
      'El canal de correo electrónico está en mantenimiento. Nuestro canal principal es WhatsApp: escribinos por ahí y retomá este formulario más tarde si necesitás documentación.',
    successMessage: '¡Consulta enviada correctamente! Te responderemos a la brevedad.',
    errorMessage: 'No se pudo enviar la consulta. Intentá nuevamente más tarde.',
    unexpectedErrorMessage: 'Ocurrió un error inesperado. Intentá nuevamente más tarde.'
  },

  consent: {
    title: 'Usamos cookies para analítica',
    description:
      'Aceptá para habilitar Google Analytics 4 y Microsoft Clarity. Podés revisar los detalles en la sección legal del sitio.',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Rechazar'
  },

  whatsappFab: {
    ariaLabel: 'Abrir chat de WhatsApp'
  }
}
