/*
Path: src/infrastructure/content/Appcontent.ts
*/

import type { AppContent, CommercialConfig } from '@/domain/types/content'
import analyticsDashboard from '@/assets/analytics-dashboard.svg'
import heroIllustration from '@/assets/hero-energy.svg'
import installTools from '@/assets/install-tools.svg'
import powermeter from '@/assets/powermeter.svg'
import teamTraining from '@/assets/team-training.svg'

export const PRICE_FALLBACK_LABEL = 'Consultar al WhatsApp'

// CEO rule:
// - Publicamos 1 solo precio (Diagnóstico) como filtro fuerte.
// - Ese precio SIEMPRE viene del backend.
// - Fallback universal: "Consultar al WhatsApp".
export const commercialConfig: CommercialConfig = {
  baseOperativa: 'Garín (GBA Norte)',

  // No publicamos "desde" ni tarifas base en web
  tarifaBaseDesdeARS: null,
  trasladoMinimoARS: null,

  whatsappUrl: 'https://wa.me/5491156297160',

  // Diagnóstico (único precio público) — SIEMPRE desde backend
  visitaDiagnosticoHasta2hARS: null,
  diagnosticoHoraAdicionalARS: null,

  descuentos: {
    cooperativasPct: 0,
    pymeGraficaPct: 0
  },
  equipos: {
    medidorNombre: 'Powermeter',
    automateNombre: 'Automate'
  }
}

export const content: AppContent = buildAppContent(commercialConfig)

export function buildAppContent(config: CommercialConfig): AppContent {
  const BASE = config.baseOperativa
  const POWERMETER = config.equipos.medidorNombre
  const AUTOMATE = config.equipos.automateNombre
  const WHATSAPP_URL = config.whatsappUrl

  // Pricing display policy
  const LISTA_DIAG_2H = formatARSWithFallback(config.visitaDiagnosticoHasta2hARS) // único precio público (desde backend)
  const CONSULTAR = PRICE_FALLBACK_LABEL

  // Copy rules
  const TRASLADO_TEXT = ` (${CONSULTAR})`
  const DIAG_EXCEDENTE_TEXT = 'Excedentes y trabajos de intervención: se cotizan según alcance y condiciones.'
  const DIAG_COTIZADOR_NOTE =
    'Precio de lista. El cotizador puede aplicar descuentos si se cumplen condiciones operativas (turno programado, acceso listo, baja burocracia, ventana segura confirmada).'

  return {
    hero: {
      badge: 'Criterio técnico · Seguridad primero · Cierre documentado',
      title: 'Diagnóstico y control industrial, sin improvisación',
      subtitle: `Instalación de ${POWERMETER}/${AUTOMATE} y diagnóstico eléctrico industrial con método: checklist, verificación final y handoff documentado en cada visita.`,
      responseNote: `Modelo de trabajo: primero diagnóstico en planta → luego intervención con alcance claro. Base: ${BASE}${TRASLADO_TEXT}. Cobertura AMBA (prioridad GBA Norte).`,
      primaryCta: {
        label: 'Coordinar diagnóstico por WhatsApp',
        action: 'whatsapp',
        href: WHATSAPP_URL
      },
      secondaryCta: {
        label: 'Ver servicios',
        href: '#servicios'
      },
      benefits: [
        {
          title: 'Diagnóstico como primer paso',
          text: `Diagnóstico técnico en planta (hasta 2 horas): ${LISTA_DIAG_2H}. Incluye registro e informe breve con hallazgos y próximos pasos.`,
          variant: 'success'
        },
        {
          title: 'Ejecución presentable para terceros (B2B2B)',
          text: 'Trabajo prolijo y documentado, ideal para proveedores e integradores que necesitan evidencias, checklist y cierre técnico claro.',
          variant: 'primary'
        },
        {
          title: 'Seguridad primero',
          text: 'Si no hay condiciones para intervenir con seguridad, se documenta, se propone adecuación mínima con tablero desenergizado y se reprograma.',
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
          description: `Relevamos el tablero, instalamos el ${POWERMETER}/${AUTOMATE} y dejamos la medición/función operativa con verificación final y documentación.`,
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
            caption: `Precio: ${CONSULTAR}. Traslado según distancia desde ${BASE}${TRASLADO_TEXT}. Equipo provisto por el cliente.`
          },
          cta: {
            label: 'Consultar por WhatsApp',
            action: 'whatsapp',
            href: WHATSAPP_URL,
            section: 'servicios-instalacion'
          }
        },

        {
          id: 'diagnostico',
          title: 'Diagnóstico técnico en planta (hasta 2 horas)',
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
            'Identificación de causa probable y plan de corrección (inmediato o programado).',
            'Registro de hallazgos + recomendaciones para prevenir recurrencia.'
          ],
          note: `Precio de lista: ${LISTA_DIAG_2H} (hasta 2 horas). ${DIAG_EXCEDENTE_TEXT} ${DIAG_COTIZADOR_NOTE} Seguridad primero: si el tablero no permite intervenir con seguridad, se documenta y se reprograma.`,
          figure: {
            src: analyticsDashboard,
            alt: 'Ilustración de mediciones y checklist',
            width: 160,
            height: 140,
            caption: 'Cobertura AMBA (prioridad GBA Norte). Coordinación por WhatsApp.'
          },
          cta: {
            label: 'Coordinar diagnóstico por WhatsApp',
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
        `DataMaq brinda servicios técnicos para industria: diagnóstico eléctrico, instalación de ${POWERMETER}/${AUTOMATE} y asistencia en campo con criterio operativo.`,
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
      note: `Base: ${BASE} · AMBA (prioridad GBA Norte) · Diagnóstico en planta · Instalación ${POWERMETER}/${AUTOMATE} · Documentación y handoff`
    },

    legal: {
      text: `DataMaq compite por criterio técnico: primero se realiza un diagnóstico en planta para definir alcance, riesgos y próximos pasos. El único precio publicado es el Diagnóstico técnico en planta (hasta 2 horas): ${LISTA_DIAG_2H}. Si el backend no está disponible, el sitio mostrará "${CONSULTAR}". El precio mostrado es de lista y el cotizador puede aplicar descuentos si se cumplen condiciones operativas (por ejemplo: turno programado, acceso listo, baja burocracia, ventana segura confirmada). Excedentes y trabajos de intervención se cotizan según alcance. Seguridad primero: si al llegar no están dadas las condiciones seguras (acceso, permisos, ventana, desenergización cuando aplica), se documenta el estado y se reprograma. El traslado se coordina según distancia desde ${BASE}${TRASLADO_TEXT}. En casos particulares que requieran intervención o firmas habilitantes, se coordina con profesional matriculado. Las cookies de analítica (GA4 y Clarity) se habilitan únicamente tras tu consentimiento explícito.`
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
}

function formatARSWithFallback(value: number | null): string {
  if (value == null || Number.isNaN(value) || value < 0) return PRICE_FALLBACK_LABEL
  return formatARS(value)
}

function formatARS(value: number): string {
  const rounded = Math.round(value)
  const withThousands = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `ARS ${withThousands}`
}