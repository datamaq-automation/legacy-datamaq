/*
Path: src/infrastructure/content/content.ts
*/

import type { AppContent, CommercialConfig } from '@/domain/types/content'
import analyticsDashboard from '@/assets/analytics-dashboard.svg'
import heroIllustration from '@/assets/hero-energy.svg'
import installTools from '@/assets/install-tools.svg'
import powermeter from '@/assets/powermeter.svg'
import teamTraining from '@/assets/team-training.svg'

export const publicConfig = {
  whatsappNumber: '5491135162685',
  whatsappPresetMessage: 'Vengo de la página web, quiero más información.',
  clarityProjectId: 'u24qtujrmg',
  ga4Id: 'G-X1ZQB8QLJC',
  analyticsEnabled: true,
  siteUrl: 'https://www.profebustos.com.ar',
  siteName: 'ProfeBustos',
  siteDescription: 'Servicios industriales y eficiencia energetica para empresas del GBA Norte.',
  siteOgImage: 'https://www.profebustos.com.ar/og-default.png',
  siteLocale: 'es_AR',
  gscVerification: undefined,
  businessName: undefined,
  businessTelephone: undefined,
  businessEmail: undefined,
  businessStreet: undefined,
  businessLocality: undefined,
  businessRegion: undefined,
  businessPostalCode: undefined,
  businessCountry: 'AR',
  businessLat: undefined,
  businessLng: undefined,
  businessArea: undefined,
  contactEmail: 'contacto@profebustos.com.ar',
  contactApiUrl: 'http://localhost:5000/v1/contact/email'
} as const

export const commercialConfig: CommercialConfig = {
  baseOperativa: 'Garín (GBA Norte)', // base prioritaria
  tarifaBaseDesdeARS: 180000, // instalación típica 1 Powermeter (equipo provisto por el cliente)
  trasladoMinimoARS: 0, // si querés publicar mínimo, setear valor (ej. 25000)
  descuentos: {
    cooperativasPct: 0,
    pymeGraficaPct: 0
  },
  equipos: {
    medidorNombre: 'Powermeter',
    automateNombre: 'Automate'
  }
}

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value)

const TARIFA_BASE = formatARS(commercialConfig.tarifaBaseDesdeARS)
const BASE = commercialConfig.baseOperativa
const POWERMETER = commercialConfig.equipos.medidorNombre

const HAS_TRASLADO_MIN = commercialConfig.trasladoMinimoARS > 0
const TRASLADO_MIN = HAS_TRASLADO_MIN ? formatARS(commercialConfig.trasladoMinimoARS) : ''
const TRASLADO_TEXT = HAS_TRASLADO_MIN ? ` (mínimo ${TRASLADO_MIN})` : ''

export const content: AppContent = {
  hero: {
    badge: 'Tarifa base publicada · Respuesta en menos de 24 horas',
    title: 'Instalación Powermeter industrial, prolija y segura',
    subtitle:
      `Instalamos 1 ${POWERMETER} (equipo provisto por el cliente) y dejamos la medición operativa desde el primer día: verificación en tablero, prueba de lectura y documentación del punto de medición.`,
    responseNote:
      `En menos de 24 horas te respondemos con: tarifa base desde ${TARIFA_BASE} (instalación típica ~4 horas), traslado según distancia desde ${BASE}${TRASLADO_TEXT}, y agenda de visita. Atención de urgencias y fuera de horario docente (incluye sábados, domingos y feriados).`,
    chatUnavailableMessage:
      'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos, gracias por tu paciencia.',
    primaryCta: {
      label: 'Agendar visita por WhatsApp',
      action: 'whatsapp'
    },
    secondaryCta: {
      label: 'Ver servicios',
      href: '#servicios'
    },
    benefits: [
      {
        title: 'Tarifa base clara',
        text: `Pack base: instalación de 1 ${POWERMETER} desde ${TARIFA_BASE}. Traslado según distancia desde ${BASE}${TRASLADO_TEXT}.`,
        variant: 'success'
      },
      {
        title: 'Instalación documentada y verificable',
        text: 'Checklist de seguridad, revisión del tablero y lectura de referencia al finalizar. Queda registrado qué se instaló y cómo quedó.',
        variant: 'primary'
      },
      {
        title: 'Urgencias y disponibilidad extendida',
        text: 'Atención fuera de horario docente. Disponible sábados, domingos y feriados (con agenda y prioridad según caso).',
        variant: 'warning'
      }
    ],
    image: {
      src: heroIllustration,
      alt: 'Ilustración de medición eléctrica industrial y tablero',
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
            'Servicio orientado a industria (GBA Norte prioritario). Atención fuera de horario docente y fines de semana según urgencia.'
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
        title: 'Urgencias industriales fuera de horario docente',
        description:
          'Atendemos casos urgentes en planta cuando hay criticidad operativa. Incluye disponibilidad fuera de horario docente y cobertura en sabados, domingos y feriados segun agenda.',
        subtitle: 'Incluye',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustracion de atencion de urgencias y diagnostico en planta',
          width: 160,
          height: 140
        },
        items: [
          'Priorizacion segun criticidad, seguridad y disponibilidad operativa.',
          'Intervenciones fuera de horario docente y fines de semana con coordinacion previa.',
          'Relevamiento y plan de accion inmediato o programado segun el caso.'
        ],
        note:
          'Condiciones: no se interviene si el entorno no es seguro, se agenda por prioridad y puede aplicar recargo por urgencia.',
        cta: {
          label: 'Solicitar urgencia por WhatsApp',
          action: 'whatsapp',
          section: 'servicios-urgencias'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de linea. Volve a intentar en unos minutos.'
      }
    ]
  },

  about: {
    title: 'Sobre DataMaq',
    paragraphs: [
      'DataMaq brinda servicios técnicos industriales con foco en medición eléctrica y diagnóstico confiable. El objetivo es que tu planta tenga datos reales (no suposiciones) y que las intervenciones queden prolijas, seguras y documentadas.',
      `Base operativa: ${BASE}. Cobertura prioritaria GBA Norte y AMBA según disponibilidad. Trabajo por objetivos y disponibilidad extendida (incluye sábados, domingos y feriados).`
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
    contactLabel: 'Agendar por WhatsApp'
  },

  footer: {
    note: `Cobertura: ${BASE} (prioridad GBA Norte) · Servicios industriales por objetivos · Atención extendida`
  },

  legal: {
    text:
      `La tarifa base publicada corresponde a la instalación de 1 ${POWERMETER} (equipo provisto por el cliente) y una verificación de lectura de referencia al finalizar. El traslado se cotiza según distancia desde ${BASE}${TRASLADO_TEXT}. Si el tablero/instalación requiere adecuaciones mínimas de seguridad, se informa y presupuesta antes de intervenir. Canal principal: WhatsApp. Las cookies de analítica (GA4 y Clarity) se habilitan únicamente tras tu consentimiento explícito.`
  },

  contact: {
    title: '¿Querés recibir una propuesta por correo?',
    subtitle:
      `Completá el formulario y te enviamos: tarifa base (${TARIFA_BASE}), condiciones de traslado desde ${BASE}${TRASLADO_TEXT} y próximos pasos para coordinar la visita. Si es una urgencia, el canal más rápido es WhatsApp.`,
    labels: {
      name: 'Nombre y apellido',
      email: 'Correo electrónico',
      company: 'Empresa (opcional)',
      message: 'Mensaje (opcional)'
    },
    submitLabel: 'Enviar consulta por correo',
    checkingMessage: 'Verificando la disponibilidad del servicio de correo electrónico…',
    unavailableMessage:
      'El canal de correo electrónico está en mantenimiento. Nuestro canal principal es WhatsApp: agendá la visita allí y retomá este formulario más tarde si necesitás documentación.',
    successMessage: '¡Consulta enviada correctamente! Te responderemos a la brevedad.',
    errorMessage: 'No se pudo enviar la consulta. Intenta nuevamente más tarde.',
    unexpectedErrorMessage: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
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
