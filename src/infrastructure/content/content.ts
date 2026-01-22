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
  baseOperativa: 'Garín', // <-- tu base operativa
  tarifaBaseDesdeARS: 0, // <-- completar
  trasladoMinimoARS: 0, // <-- completar
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
const TRASLADO_MIN = formatARS(commercialConfig.trasladoMinimoARS)
const BASE = commercialConfig.baseOperativa
const POWERMETER = commercialConfig.equipos.medidorNombre
const AUTOMATE = commercialConfig.equipos.automateNombre


export const content: AppContent = {
  hero: {
    badge: 'Diagnóstico sin cargo + tarifa base publicada',
    title: 'Medición eléctrica lista y segura en tu planta',
    subtitle:
      `Instalamos 1 ${POWERMETER} y dejamos la medición operativa junto al ${AUTOMATE} (configuración inicial y verificación), con documentación para que el punto de medición quede confiable desde el primer día.`,
    responseNote:
      `Respuesta en menos de 24 horas con: tarifa base desde ${TARIFA_BASE}, traslado según distancia desde ${BASE} (mínimo ${TRASLADO_MIN}) y agenda de visita. Descuentos para cooperativas y PyME gráfica.`,
    chatUnavailableMessage:
      'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos, gracias por tu paciencia.',
    primaryCta: {
      label: 'Agendar visita por WhatsApp',
      action: 'whatsapp'
    },
    secondaryCta: {
      label: 'Ver el pack de instalación',
      href: '#servicios'
    },
    benefits: [
      {
        title: 'Tarifa base clara',
        text: `Pack base: instalación de 1 ${POWERMETER} desde ${TARIFA_BASE}. Traslado según distancia desde ${BASE} (mínimo ${TRASLADO_MIN}).`,
        variant: 'success'
      },
      {
        title: 'Instalación segura y documentada',
        text: 'Checklist de seguridad, verificación en tablero y registro inicial de referencia para evitar lecturas “raras” desde el arranque.',
        variant: 'primary'
      },
      {
        title: 'Descuentos cooperativas y PyME gráfica',
        text: 'Si sos cooperativa o PyME del sector gráfico, aplicamos descuento sobre la tarifa base.',
        variant: 'warning'
      }
    ],
    image: {
      src: heroIllustration,
      alt: 'Ilustración de tablero digital con medición eléctrica',
      width: 420,
      height: 320
    }
  },

  services: {
    title: 'Servicios',
    cards: [
      {
        id: 'instalacion',
        title: 'Pack base: instalación de 1 Powermeter + Automate',
        description:
          'Relevamos el tablero, instalamos el Powermeter y dejamos el Automate configurado para la puesta en marcha. Ideal para empezar a medir con criterios de seguridad y con documentación.',
        subtitle: 'Incluye',
        media: {
          src: installTools,
          alt: 'Ilustración de herramientas y plano técnico',
          width: 140,
          height: 120
        },
        items: [
          'Diagnóstico en sitio (tablero, protecciones, accesibilidad y punto de instalación).',
          'Instalación del Powermeter + verificación básica (lectura de referencia).',
          'Configuración inicial del Automate + documentación (fotos, checklist y parámetros).'
        ],
        figure: {
          src: powermeter,
          alt: 'Ilustración de medidor Powermeter',
          width: 220,
          height: 140,
          caption:
            'Tarifa base desde $[TARIFA_BASE]. Traslado según distancia desde [BASE_OPERATIVA] (mínimo $[TRASLADO_MIN]). Descuento disponible para cooperativas y PyME gráfica.'
        },
        cta: {
          label: 'Agendar visita por WhatsApp',
          action: 'whatsapp',
          section: 'servicios-instalacion'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      },

      {
        id: 'consultoria',
        title: 'Diagnóstico de tablero y adecuación (si aplica)',
        description:
          'Si el tablero no está en condiciones seguras (orden, señalización, posibilidad de corte, protecciones, etc.), primero diagnosticamos y cotizamos la adecuación necesaria. Luego reprogramamos la instalación del Powermeter.',
        subtitle: 'Resultado',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustración de checklist y evaluación técnica',
          width: 160,
          height: 140
        },
        items: [
          'Checklist de seguridad y buenas prácticas en el tablero.',
          'Listado de correcciones requeridas y recomendaciones mínimas.',
          'Presupuesto de adecuación + reprogramación de la instalación del Powermeter.'
        ],
        note:
          'No instalamos en condiciones inseguras. El objetivo es que el trabajo se pueda hacer con corte, orden y criterios claros de seguridad.',
        figure: {
          src: analyticsDashboard,
          alt: 'Ilustración de checklist y evaluación técnica',
          width: 160,
          height: 140
        },
        cta: {
          label: 'Consultar diagnóstico por WhatsApp',
          action: 'whatsapp',
          section: 'servicios-adecuacion'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      }
    ]
  },

  about: {
    title: 'Sobre profebustos',
    paragraphs: [
      'profebustos está liderado por profesionales con experiencia en instalaciones industriales y docencia técnica. Nuestro foco es dejar medición eléctrica operativa con criterios de seguridad, documentación y puesta en marcha ordenada.',
      'Trabajamos principalmente en GBA y priorizamos intervenciones claras: diagnóstico, condiciones de seguridad, instalación de Powermeter, configuración inicial del Automate y verificación de referencia.'
    ],
    image: {
      src: teamTraining,
      alt: 'Ilustración de equipo técnico en sesión de formación',
      width: 240,
      height: 180
    }
  },

  navbar: {
    brand: 'profebustos',
    brandAriaLabel: 'profebustos, inicio',
    links: [
      {
        label: 'Servicios',
        href: '#servicios'
      }
    ],
    contactLabel: 'Agendar visita por WhatsApp'
  },

  footer: {
    note: 'Cobertura: GBA (traslado por distancia) · Descuento: cooperativas y PyME gráfica'
  },

  legal: {
    text:
      'La tarifa base publicada corresponde al pack de instalación de 1 Powermeter (con configuración inicial del Automate). El traslado se cotiza según distancia desde [BASE_OPERATIVA] con un mínimo de $[TRASLADO_MIN]. Si el tablero requiere adecuación, se presupone tras el diagnóstico y se reprograma la instalación. Canal principal: WhatsApp (y chat cuando esté disponible). Las cookies de analítica (GA4 y Clarity) se habilitan únicamente tras tu consentimiento explícito.'
  },

  contact: {
    title: '¿Necesitás recibir la propuesta por correo?',
    subtitle:
      'Completá el formulario y te enviamos la tarifa base, condiciones de traslado y próximos pasos. Si el tablero requiere adecuación, te enviamos el presupuesto por separado.',
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
