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
  baseOperativa: 'Garin (GBA Norte)',
  tarifaBaseDesdeARS: 380000,
  trasladoMinimoARS: 0,
  whatsappUrl: 'https://wa.me/5491156297160',
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
const AUTOMATE = commercialConfig.equipos.automateNombre
const WHATSAPP_URL = commercialConfig.whatsappUrl
const WHATSAPP_BASE = 'Hola, vengo de la web de DataMaq.'
const WHATSAPP_TRIAGE =
  '\n\nPara cotizar rapido:\n1) Zona (AMBA):\n2) ¿Se puede desenergizar el tablero para trabajar seguro? (si/no)\n3) Enviar 2 fotos del tablero y del punto de instalacion\n4) Servicio: instalacion Powermeter/Automate o diagnostico/urgencia'
const WHATSAPP_INSTALL_MESSAGE = `${WHATSAPP_BASE} Quiero coordinar una instalacion industrial (${POWERMETER}/${AUTOMATE}).${WHATSAPP_TRIAGE}`
const WHATSAPP_DIAG_MESSAGE = `${WHATSAPP_BASE} Necesito diagnostico de falla electrica/electronica en planta.${WHATSAPP_TRIAGE}`
const WHATSAPP_URG_MESSAGE = `${WHATSAPP_BASE} Tengo una urgencia industrial fuera de horario.${WHATSAPP_TRIAGE}`

const HAS_TRASLADO_MIN = commercialConfig.trasladoMinimoARS > 0
const TRASLADO_MIN = HAS_TRASLADO_MIN ? formatARS(commercialConfig.trasladoMinimoARS) : ''
const TRASLADO_TEXT = HAS_TRASLADO_MIN ? ` (minimo ${TRASLADO_MIN})` : ''

function buildWhatsAppHref(message: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}

export const content: AppContent = {
  hero: {
    badge: 'Tarifa base publicada · Respuesta en menos de 24 horas',
    title: 'Servicios industriales prolijos, seguros y documentados',
    subtitle: `Instalación de ${POWERMETER}/${AUTOMATE} y diagnóstico eléctrico industrial. Checklist previo, verificación final y cierre documentado en cada visita.`,
    responseNote: `Te respondemos por WhatsApp en menos de 24 horas con tarifa base desde ${TARIFA_BASE}, alcance incluido y condiciones (distancia/urgencia) desde ${BASE}${TRASLADO_TEXT}.`,
    primaryCta: {
      label: 'Pedí coordinación',
      action: 'whatsapp',
      href: buildWhatsAppHref(WHATSAPP_INSTALL_MESSAGE)
    },
    secondaryCta: {
      label: 'Ver servicios',
      href: '#servicios'
    },
    benefits: [
      {
        title: 'Tarifa base clara',
        text: `Instalacion industrial desde ${TARIFA_BASE}, con alcance y condiciones explicitadas antes de intervenir.`,
        variant: 'success'
      },
      {
        title: 'Implementacion documentada',
        text: 'Checklist de trabajo, registro de cambios, verificacion de lectura de referencia y cierre tecnico con observaciones.',
        variant: 'primary'
      },
      {
        title: 'Diagnóstico orientado a operación',
        text: 'Metodo de medicion y descarte para identificar causa probable, priorizar seguridad y reducir reincidencia de fallas.',
        variant: 'warning'
      }
    ],
    image: {
      src: heroIllustration,
      alt: 'Ilustracion de medicion industrial y diagnostico electrico',
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
        description: `Relevamos el tablero, instalamos el ${POWERMETER} y dejamos la medición funcionando con verificación final.`,
        subtitle: 'Incluye',
        media: {
          src: installTools,
          alt: 'Ilustracion de herramientas e instalacion tecnica',
          width: 140,
          height: 120
        },
        items: [
          'Relevamiento del tablero: accesibilidad, punto de instalacion, protecciones y condiciones de seguridad.',
          `Instalación del ${POWERMETER} y verificación de lectura de referencia.`,
          'Registro y documentación: fotos del tablero y checklist técnico.',
          'Tiempo tipico: media jornada (aprox. 4 horas), segun condiciones del tablero.'
        ],
        figure: {
          src: powermeter,
          alt: `Ilustracion de medidor ${POWERMETER}`,
          width: 220,
          height: 140,
          caption: `Tarifa base desde ${TARIFA_BASE}. Traslado según distancia desde ${BASE}${TRASLADO_TEXT}.`
        },
        cta: {
          label: 'Cotizar por WhatsApp',
          action: 'whatsapp',
          href: buildWhatsAppHref(WHATSAPP_INSTALL_MESSAGE),
          section: 'servicios-instalacion'
        }
      },
      {
        id: 'diagnostico',
        title: 'Diagnóstico y reparación de fallas eléctricas/electrónicas (industria)',
        description:
          'Diagnóstico en planta para fallas intermitentes o críticas con medición, prueba, aislamiento y propuesta de corrección.',
        subtitle: 'Resultado',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustracion de diagnostico tecnico y mediciones',
          width: 160,
          height: 140
        },
        items: [
          'Diagnóstico en campo con instrumental y método de descarte.',
          'Identificación de causa probable y plan de reparación inmediato o programado.',
          'Recomendaciones para prevenir recurrencia y mejorar seguridad del tablero.'
        ],
        note:
          'Si el tablero no permite intervenir con seguridad, se propone adecuacion minima y se reprograma la reparacion.',
        figure: {
          src: analyticsDashboard,
          alt: 'Ilustracion de mediciones y checklist',
          width: 160,
          height: 140,
          caption: 'Servicio orientado a industria (GBA Norte prioritario).'
        },
        cta: {
          label: 'Cotizar por WhatsApp',
          action: 'whatsapp',
          href: buildWhatsAppHref(WHATSAPP_DIAG_MESSAGE),
          section: 'servicios-diagnostico'
        }
      },
      {
        id: 'urgencias',
        title: 'Urgencias industriales fuera de horario',
        description:
          'Atendemos casos urgentes en planta cuando hay criticidad operativa. Incluye disponibilidad extendida segun agenda.',
        subtitle: 'Incluye',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustracion de atencion de urgencias y diagnostico en planta',
          width: 160,
          height: 140
        },
        items: [
          'Priorizacion segun criticidad, seguridad y disponibilidad operativa.',
          'Intervenciones fuera de horario y fines de semana con coordinación previa.',
          'Relevamiento y plan de acción inmediato o programado según el caso.'
        ],
        note:
          'Condiciones: no se interviene si el entorno no es seguro, se agenda por prioridad y puede aplicar recargo por urgencia.',
        cta: {
          label: 'Pedí coordinación urgente',
          action: 'whatsapp',
          href: buildWhatsAppHref(WHATSAPP_URG_MESSAGE),
          section: 'servicios-urgencias'
        }
      }
    ]
  },

  profile: {
    title: 'Perfil tecnico',
    bullets: [
      'Servicios industriales con foco en seguridad, trazabilidad y documentación.',
      'Formacion: Tecnico Electronico - Tec. Univ. en Mantenimiento Industrial - Estudiante de Lic. en IA y Robotica.',
      'Enfoque de trabajo: checklist, verificacion de funcionamiento, registro de cambios y handoff.'
    ]
  },

  about: {
    title: 'Sobre DataMaq',
    paragraphs: [
      'DataMaq brinda servicios técnicos para industria: instalación de medición, diagnóstico eléctrico y asistencia en campo con criterio operativo.',
      `Base operativa: ${BASE}. Cobertura presencial prioritaria GBA Norte y AMBA según disponibilidad.`,
      'Objetivo: decisiones técnicas con datos reales, intervenciones seguras y trabajo documentado.'
    ],
    image: {
      src: teamTraining,
      alt: 'Ilustracion de formacion tecnica y equipo de trabajo',
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
      },
      {
        label: 'Proceso',
        href: '#proceso'
      },
      {
        label: 'Tarifas',
        href: '#tarifas'
      },
      {
        label: 'Cobertura',
        href: '#cobertura'
      },
      {
        label: 'FAQ',
        href: '#faq'
      },
      {
        label: 'Contacto',
        href: '#contacto'
      }
    ],
    contactLabel: 'Pedí coordinación'
  },

  footer: {
    note: `Base: ${BASE} - Industria - Diagnóstico eléctrico - Instalación documentada`
  },

  legal: {
    text: `La tarifa base publicada para Powermeter corresponde a la instalación de 1 ${POWERMETER} (equipo provisto por el cliente) y una verificación de lectura de referencia al finalizar. El traslado se cotiza según distancia desde ${BASE}${TRASLADO_TEXT}. Si el tablero/instalación requiere adecuaciones mínimas de seguridad, se informa y presupuesta antes de intervenir. En casos particulares que requieran intervención o firmas habilitantes, se coordina con profesional matriculado. Las cookies de analítica (GA4 y Clarity) se habilitan únicamente tras tu consentimiento explícito.`
  },

  contact: {
    title: '¿Querés recibir una propuesta por correo?',
    subtitle: `Dejanos tu correo y mensaje. Te respondemos con una propuesta para servicios industriales (instalación ${POWERMETER}/${AUTOMATE} y diagnóstico eléctrico).`,
    labels: {
      email: 'Correo electrónico',
      message: 'Mensaje'
    },
    submitLabel: 'Enviar consulta por correo',
    checkingMessage: 'Verificando la disponibilidad del servicio de correo electrónico...',
    unavailableMessage:
      'El canal de correo electrónico está en mantenimiento. Escribinos por WhatsApp para coordinar una respuesta rápida.',
    successMessage: 'Consulta enviada correctamente. Te responderemos a la brevedad.',
    errorMessage: 'No se pudo enviar la consulta. Intenta nuevamente más tarde.',
    unexpectedErrorMessage: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
  },

  consent: {
    title: 'Usamos cookies para analítica',
    description:
      'Aceptá para habilitar Google Analytics 4 y Microsoft Clarity. Podés revisar los detalles en la sección legal del sitio.',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Rechazar'
  }
}
