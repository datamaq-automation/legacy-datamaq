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
  baseOperativa: 'Garín (GBA Norte)',
  tarifaBaseDesdeARS: 380000,
  trasladoMinimoARS: 0,
  whatsappUrl: 'https://wa.me/5491156297160',

  // Diagnóstico (publicado)
  visitaDiagnosticoHasta2hARS: 260000,
  diagnosticoHoraAdicionalARS: 130000,

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
const VISITA_DIAG_2H = formatARS(commercialConfig.visitaDiagnosticoHasta2hARS)
const DIAG_HORA_ADICIONAL = formatARS(commercialConfig.diagnosticoHoraAdicionalARS)

const BASE = commercialConfig.baseOperativa
const POWERMETER = commercialConfig.equipos.medidorNombre
const AUTOMATE = commercialConfig.equipos.automateNombre
const WHATSAPP_URL = commercialConfig.whatsappUrl

const HAS_TRASLADO_MIN = commercialConfig.trasladoMinimoARS > 0
const TRASLADO_MIN = HAS_TRASLADO_MIN ? formatARS(commercialConfig.trasladoMinimoARS) : ''
const TRASLADO_TEXT = HAS_TRASLADO_MIN ? ` (mínimo ${TRASLADO_MIN})` : ''

export const content: AppContent = {
  hero: {
    badge: 'Tarifa base publicada · Respuesta en menos de 24 horas hábiles (L–V 08 a 16)',
    title: 'Servicios industriales prolijos, seguros y documentados',
    subtitle: `Instalación de ${POWERMETER}/${AUTOMATE} y diagnóstico eléctrico industrial. Checklist previo, verificación final y cierre documentado en cada visita.`,
    responseNote: `Te respondemos por WhatsApp en menos de 24 horas hábiles (L–V 08 a 16) con tarifa base desde ${TARIFA_BASE}, alcance incluido y condiciones por distancia desde ${BASE}${TRASLADO_TEXT}. Cobertura: AMBA (prioridad GBA Norte).`,
    primaryCta: {
      label: 'Coordinar por WhatsApp',
      action: 'whatsapp',
      href: WHATSAPP_URL
    },
    secondaryCta: {
      label: 'Ver servicios',
      href: '#servicios'
    },
    benefits: [
      {
        title: 'Tarifa base clara',
        text: `Instalación industrial de 1 equipo (${POWERMETER} o ${AUTOMATE}) desde ${TARIFA_BASE}, con alcance y condiciones explicitadas antes de intervenir.`,
        variant: 'success'
      },
      {
        title: 'Implementación documentada',
        text: 'Checklist de trabajo, registro de cambios, verificación de lectura/función de referencia y cierre técnico con observaciones.',
        variant: 'primary'
      },
      {
        title: 'Seguridad primero',
        text: 'Si el tablero no permite intervenir con seguridad, se propone adecuación mínima con tablero desenergizado y se reprograma.',
        variant: 'warning'
      }
    ],
    image: {
      src: heroIllustration,
      alt: 'Ilustración de medición industrial y diagnóstico eléctrico',
      width: 420,
      height: 320
    }
  },

  services: {
    title: 'Servicios',
    cards: [
      {
        id: 'instalacion',
        title: `Instalación industrial de 1 equipo (${POWERMETER} o ${AUTOMATE}) (equipo provisto por el cliente)`,
        description:
          `Relevamos el tablero, instalamos el ${POWERMETER}/${AUTOMATE} y dejamos la medición/función operativa con verificación final y documentación.`,
        subtitle: 'Incluye',
        media: {
          src: installTools,
          alt: 'Ilustración de herramientas e instalación técnica',
          width: 140,
          height: 120
        },
        items: [
          'Relevamiento del tablero: accesibilidad, punto de instalación, protecciones y condiciones de seguridad.',
          `Instalación del ${POWERMETER}/${AUTOMATE} + verificación de lectura/función de referencia.`,
          'Registro y documentación: fotos del tablero/punto de instalación + checklist técnico.',
          'Tiempo típico: media jornada (aprox. 4 horas) cuando hay acceso, tablero intervenible en condiciones seguras y ventana para desenergizar si aplica.'
        ],
        figure: {
          src: powermeter,
          alt: `Ilustración de medidor ${POWERMETER}`,
          width: 220,
          height: 140,
          caption: `Tarifa base desde ${TARIFA_BASE} (1 equipo: ${POWERMETER} o ${AUTOMATE}). Traslado según distancia desde ${BASE}${TRASLADO_TEXT}. Equipo provisto por el cliente.`
        },
        cta: {
          label: 'Cotizar por WhatsApp',
          action: 'whatsapp',
          href: WHATSAPP_URL,
          section: 'servicios-instalacion'
        }
      },

      {
        id: 'diagnostico',
        title: 'Visita técnica de diagnóstico en planta (hasta 2 horas)',
        description:
          'Diagnóstico en campo para fallas intermitentes o críticas: medición, prueba, aislamiento del problema y propuesta de corrección.',
        subtitle: 'Resultado',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustración de diagnóstico técnico y mediciones',
          width: 160,
          height: 140
        },
        items: [
          'Diagnóstico con instrumental y método de descarte.',
          'Identificación de causa probable y plan de reparación inmediato o programado.',
          'Registro de hallazgos y recomendaciones para prevenir recurrencia.'
        ],
        note: `Precio: ${VISITA_DIAG_2H} (hasta 2 horas). Excedente: ${DIAG_HORA_ADICIONAL}/h. ${VISITA_DIAG_2H} se descuenta del total si aprobás el presupuesto. Si el tablero no permite intervenir con seguridad, se propone adecuación mínima con tablero desenergizado y se reprograma.`,
        figure: {
          src: analyticsDashboard,
          alt: 'Ilustración de mediciones y checklist',
          width: 160,
          height: 140,
          caption: `Cobertura AMBA (prioridad GBA Norte). Respuesta en <24h hábiles (L–V 08 a 16).`
        },
        cta: {
          label: 'Coordinar visita por WhatsApp',
          action: 'whatsapp',
          href: WHATSAPP_URL,
          section: 'servicios-diagnostico'
        }
      }
    ]
  },

  profile: {
    title: 'Perfil técnico',
    bullets: [
      'Servicios industriales con foco en seguridad, trazabilidad y documentación.',
      'Formación: Técnico Electrónico · Téc. Univ. en Mantenimiento Industrial · Estudiante de Lic. en IA y Robótica.',
      'Enfoque de trabajo: checklist, verificación de funcionamiento, registro de cambios y handoff.'
    ]
  },

  about: {
    title: 'Sobre DataMaq',
    paragraphs: [
      `DataMaq brinda servicios técnicos para industria: instalación de ${POWERMETER}/${AUTOMATE}, diagnóstico eléctrico y asistencia en campo con criterio operativo.`,
      `Base operativa: ${BASE}. Cobertura: AMBA (prioridad GBA Norte). Fuera de AMBA: consultar.`,
      'Oferta ampliada para industria gráfica: mantenimiento y reparación de maquinaria en alcance eléctrico/electrónico y control (sin mecánica), con decisiones técnicas basadas en datos reales.'
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
      { label: 'Servicios', href: '#servicios' },
      { label: 'Perfil', href: '#perfil' },
      { label: 'Contacto', href: '#contacto' }
    ],
    contactLabel: 'WhatsApp'
  },

  footer: {
    note: `Base: ${BASE} · AMBA (prioridad GBA Norte) · Instalación ${POWERMETER}/${AUTOMATE} · Diagnóstico en planta · Documentación y handoff`
  },

  legal: {
    text: `La tarifa base publicada corresponde a la instalación de 1 equipo (${POWERMETER} o ${AUTOMATE}) provisto por el cliente, e incluye verificación de lectura/función de referencia al finalizar y cierre documentado. El traslado se cotiza según distancia desde ${BASE}${TRASLADO_TEXT}. La visita técnica de diagnóstico en planta (hasta 2 horas) tiene un precio publicado de ${VISITA_DIAG_2H}; el excedente se cobra a ${DIAG_HORA_ADICIONAL}/h, y ${VISITA_DIAG_2H} se descuenta del total si aprobás el presupuesto (sin vencimiento). Si el tablero/instalación requiere adecuaciones mínimas de seguridad, se informa y presupuesta antes de intervenir (con ventana para desenergizar). En casos particulares que requieran intervención o firmas habilitantes, se coordina con profesional matriculado. Las cookies de analítica (GA4 y Clarity) se habilitan únicamente tras tu consentimiento explícito.`
  },

  contact: {
    title: 'Contacto',
    subtitle:
      'Dejanos tu email y consulta para seguimiento comercial, o escribinos por WhatsApp si necesitás coordinación rápida.',
    labels: {
      email: 'Correo electrónico',
      message: 'Mensaje'
    },
    submitLabel: 'Registrar consulta',
    checkingMessage: 'Registrando tu consulta...',
    unavailableMessage:
      'El formulario está temporalmente en mantenimiento. Escribinos por WhatsApp para coordinar una respuesta rápida.',
    successMessage: '¡Listo! Registramos tu consulta. Te vamos a responder a la brevedad (días hábiles).',
    errorMessage: 'No se pudo registrar la consulta. Intentá nuevamente más tarde.',
    unexpectedErrorMessage: 'Ocurrió un error inesperado. Intentá nuevamente más tarde.'
  },

  consent: {
    title: 'Usamos cookies para analítica',
    description:
      'Aceptá para habilitar Google Analytics 4 y Microsoft Clarity. Podés revisar los detalles en la sección legal del sitio.',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Rechazar'
  }
}
