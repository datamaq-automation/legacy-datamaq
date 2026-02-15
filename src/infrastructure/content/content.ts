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
  tarifaBaseDesdeARS: 180000,
  trasladoMinimoARS: 0,
  whatsappUrl: 'https://wa.me/5491135162685',
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

const HAS_TRASLADO_MIN = commercialConfig.trasladoMinimoARS > 0
const TRASLADO_MIN = HAS_TRASLADO_MIN ? formatARS(commercialConfig.trasladoMinimoARS) : ''
const TRASLADO_TEXT = HAS_TRASLADO_MIN ? ` (minimo ${TRASLADO_MIN})` : ''

function buildWhatsAppHref(message: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}

export const content: AppContent = {
  hero: {
    badge: 'Tarifa base publicada - Respuesta en menos de 24 horas',
    title: 'Servicios industriales prolijos, seguros y documentados',
    subtitle: `Instalacion de ${POWERMETER}/${AUTOMATE} y diagnostico electrico industrial. Checklist previo, verificacion final y cierre documentado en cada visita.`,
    responseNote: `Te respondemos por WhatsApp en menos de 24 horas con tarifa base desde ${TARIFA_BASE}, alcance incluido y variaciones por distancia/urgencia desde ${BASE}${TRASLADO_TEXT}.`,
    primaryCta: {
      label: 'Pedi coordinacion',
      action: 'whatsapp',
      href: buildWhatsAppHref(
        'Hola, quiero coordinar un servicio industrial. Servicio: [indicar]. Zona: [indicar]. Urgencia: [baja/media/alta].'
      )
    },
    secondaryCta: {
      label: 'Ver servicios',
      href: '#servicios'
    },
    benefits: [
      {
        title: 'Tarifa base clara',
        text: `Instalacion industrial de 1 ${POWERMETER} desde ${TARIFA_BASE}, con alcance y condiciones explicitadas antes de intervenir.`,
        variant: 'success'
      },
      {
        title: 'Implementacion documentada',
        text: 'Checklist de trabajo, registro de cambios, verificacion de lectura de referencia y cierre tecnico con observaciones.',
        variant: 'primary'
      },
      {
        title: 'Diagnostico orientado a operacion',
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
        title: `Instalacion industrial de 1 ${POWERMETER} (equipo provisto por el cliente)`,
        description: `Relevamos el tablero, instalamos el ${POWERMETER} y dejamos la medicion funcionando con verificacion final.`,
        subtitle: 'Incluye',
        media: {
          src: installTools,
          alt: 'Ilustracion de herramientas e instalacion tecnica',
          width: 140,
          height: 120
        },
        items: [
          'Relevamiento del tablero: accesibilidad, punto de instalacion, protecciones y condiciones de seguridad.',
          `Instalacion del ${POWERMETER} y verificacion de lectura de referencia.`,
          'Registro y documentacion: fotos del tablero y checklist tecnico.',
          'Tiempo tipico: media jornada (aprox. 4 horas), segun condiciones del tablero.'
        ],
        figure: {
          src: powermeter,
          alt: `Ilustracion de medidor ${POWERMETER}`,
          width: 220,
          height: 140,
          caption: `Tarifa base desde ${TARIFA_BASE}. Traslado segun distancia desde ${BASE}${TRASLADO_TEXT}.`
        },
        cta: {
          label: 'Cotizar por WhatsApp',
          action: 'whatsapp',
          href: buildWhatsAppHref(
            'Hola, quiero coordinar instalacion industrial de Powermeter. Zona: [indicar]. Urgencia: [baja/media/alta].'
          ),
          section: 'servicios-instalacion'
        }
      },
      {
        id: 'diagnostico',
        title: 'Diagnostico y reparacion de fallas electricas/electronicas (industria)',
        description:
          'Diagnostico en planta para fallas intermitentes o criticas con medicion, prueba, aislamiento y propuesta de correccion.',
        subtitle: 'Resultado',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustracion de diagnostico tecnico y mediciones',
          width: 160,
          height: 140
        },
        items: [
          'Diagnostico en campo con instrumental y metodo de descarte.',
          'Identificacion de causa probable y plan de reparacion inmediato o programado.',
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
          href: buildWhatsAppHref(
            'Hola, quiero coordinar diagnostico en planta. Zona: [indicar]. Urgencia: [baja/media/alta].'
          ),
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
          'Intervenciones fuera de horario y fines de semana con coordinacion previa.',
          'Relevamiento y plan de accion inmediato o programado segun el caso.'
        ],
        note:
          'Condiciones: no se interviene si el entorno no es seguro, se agenda por prioridad y puede aplicar recargo por urgencia.',
        cta: {
          label: 'Pedi coordinacion urgente',
          action: 'whatsapp',
          href: buildWhatsAppHref(
            'Hola, necesito atencion urgente en planta. Servicio: [indicar]. Zona: [indicar]. Urgencia: alta.'
          ),
          section: 'servicios-urgencias'
        }
      }
    ]
  },

  profile: {
    title: 'Perfil tecnico',
    bullets: [
      'Servicios industriales con foco en seguridad, trazabilidad y documentacion.',
      'Formacion: Tecnico Electronico - Tec. Univ. en Mantenimiento Industrial - Estudiante de Lic. en IA y Robotica.',
      'Enfoque de trabajo: checklist, verificacion de funcionamiento, registro de cambios y handoff.'
    ]
  },

  about: {
    title: 'Sobre DataMaq',
    paragraphs: [
      'DataMaq brinda servicios tecnicos para industria: instalacion de medicion, diagnostico electrico y asistencia en campo con criterio operativo.',
      `Base operativa: ${BASE}. Cobertura presencial prioritaria GBA Norte y AMBA segun disponibilidad.`,
      'Objetivo: decisiones tecnicas con datos reales, intervenciones seguras y trabajo documentado.'
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
    contactLabel: 'Pedi coordinacion'
  },

  footer: {
    note: `Base: ${BASE} - Industria - Diagnostico electrico - Instalacion documentada`
  },

  legal: {
    text: `La tarifa base publicada para Powermeter corresponde a la instalacion de 1 ${POWERMETER} (equipo provisto por el cliente) y una verificacion de lectura de referencia al finalizar. El traslado se cotiza segun distancia desde ${BASE}${TRASLADO_TEXT}. Si el tablero/instalacion requiere adecuaciones minimas de seguridad, se informa y presupuesta antes de intervenir. En casos particulares que requieran intervencion o firmas habilitantes, se coordina con profesional matriculado. Las cookies de analitica (GA4 y Clarity) se habilitan unicamente tras tu consentimiento explicito.`
  },

  contact: {
    title: 'Queres recibir una propuesta por correo?',
    subtitle: `Completa el formulario y te enviamos una propuesta para servicios industriales (instalacion ${POWERMETER}/${AUTOMATE} y diagnostico electrico). Si es urgente, escribinos por WhatsApp.`,
    labels: {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo electronico',
      phone: 'Telefono (opcional)',
      city: 'Ciudad (opcional)',
      country: 'Pais',
      company: 'Empresa (opcional)'
    },
    submitLabel: 'Enviar consulta por correo',
    checkingMessage: 'Verificando la disponibilidad del servicio de correo electronico...',
    unavailableMessage:
      'El canal de correo electronico esta en mantenimiento. Escribinos por WhatsApp para coordinar una respuesta rapida.',
    successMessage: 'Consulta enviada correctamente. Te responderemos a la brevedad.',
    errorMessage: 'No se pudo enviar la consulta. Intenta nuevamente mas tarde.',
    unexpectedErrorMessage: 'Ocurrio un error inesperado. Intenta nuevamente mas tarde.'
  },

  consent: {
    title: 'Usamos cookies para analitica',
    description:
      'Acepta para habilitar Google Analytics 4 y Microsoft Clarity. Podes revisar los detalles en la seccion legal del sitio.',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Rechazar'
  }
}
