/*
Path: src/infrastructure/content/Appcontent.ts
*/

import type { AppContent, CommercialConfig } from '@/domain/types/content'
import analyticsDashboard from '@/assets/analytics-dashboard.svg'
import heroIllustration from '@/assets/hero-energy.svg'
import installTools from '@/assets/install-tools.svg'
import powermeter from '@/assets/powermeter.svg'
import teamTraining from '@/assets/team-training.svg'
import { appcontentDatamaq } from '@/infrastructure/content/Appcontent.datamaq'
import { appcontentExample } from '@/infrastructure/content/Appcontent.example'
import { appcontentUpp } from '@/infrastructure/content/Appcontent.upp'
import { activeRuntimeProfile } from '@/infrastructure/content/runtimeProfile'

export const PRICE_FALLBACK_LABEL = 'Consultar al WhatsApp'
const DEFAULT_BRAND_NAME = 'Sitio'
const DEFAULT_BASE_OPERATIVA = 'Garin (GBA Norte)'
const DEFAULT_WHATSAPP_URL = 'https://wa.me/'

export const runtimeProfile = activeRuntimeProfile

const baseCommercialConfig = resolveAppContentPreset(runtimeProfile.brandId)

const BRAND_NAME =
  runtimeProfile.brandName || runtimeProfile.siteName || baseCommercialConfig.brandName || DEFAULT_BRAND_NAME
const BRAND_ARIA_LABEL =
  runtimeProfile.brandAriaLabel || baseCommercialConfig.brandAriaLabel || `${BRAND_NAME}, inicio`
const BASE_OPERATIVA =
  runtimeProfile.baseOperativa || baseCommercialConfig.baseOperativa || DEFAULT_BASE_OPERATIVA
const WHATSAPP_URL = runtimeProfile.whatsappUrl || baseCommercialConfig.whatsappUrl || DEFAULT_WHATSAPP_URL

// CEO rule:
// - Publicamos 1 solo precio (DiagnÃ³stico) como filtro fuerte.
// - Ese precio SIEMPRE viene del backend.
// - Fallback universal: "Consultar al WhatsApp".
export const commercialConfig: CommercialConfig = {
  ...baseCommercialConfig,
  brandName: BRAND_NAME,
  brandAriaLabel: BRAND_ARIA_LABEL,
  baseOperativa: BASE_OPERATIVA,
  whatsappUrl: WHATSAPP_URL,
  descuentos: {
    ...baseCommercialConfig.descuentos
  },
  equipos: {
    ...baseCommercialConfig.equipos
  }
}

export const content: AppContent = buildAppContent(commercialConfig)

function resolveAppContentPreset(brandId: string | undefined): CommercialConfig {
  const normalizedBrandId = brandId?.trim().toLowerCase()

  if (normalizedBrandId === 'datamaq') {
    return cloneCommercialConfig(appcontentDatamaq)
  }

  if (normalizedBrandId === 'upp') {
    return cloneCommercialConfig(appcontentUpp)
  }

  return cloneCommercialConfig(appcontentExample)
}

function cloneCommercialConfig(config: CommercialConfig): CommercialConfig {
  return {
    ...config,
    descuentos: {
      ...config.descuentos
    },
    equipos: {
      ...config.equipos
    }
  }
}

function formatArsAmount(value: number | null): string {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return PRICE_FALLBACK_LABEL
  }

  return `ARS ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(Math.round(value))}`
}

export function buildAppContent(config: CommercialConfig): AppContent {
  const BRAND_NAME = config.brandName
  const BRAND_ARIA_LABEL = config.brandAriaLabel
  const BASE = config.baseOperativa
  const POWERMETER = config.equipos.medidorNombre
  const AUTOMATE = config.equipos.automateNombre
  const WHATSAPP_URL = config.whatsappUrl

  // Pricing display policy
  const CONSULTAR = PRICE_FALLBACK_LABEL
  const LISTA_DIAG_2H = formatArsAmount(config.visitaDiagnosticoHasta2hARS)

  // Copy rules
  const TRASLADO_TEXT = ` (${CONSULTAR})`
  const DIAG_EXCEDENTE_TEXT = 'Excedentes y trabajos de intervenciÃ³n: se cotizan segÃºn alcance y condiciones.'
  const DIAG_COTIZADOR_NOTE =
    'Precio de lista. El cotizador puede aplicar descuentos si se cumplen condiciones operativas (turno programado, acceso listo, baja burocracia, ventana segura confirmada).'

  return {
    hero: {
      badge: 'Criterio tÃ©cnico Â· Seguridad primero Â· Cierre documentado',
      title: 'Diagn\u00f3stico y control industrial, sin improvisaci\u00f3n',
      subtitle: `InstalaciÃ³n de ${POWERMETER}/${AUTOMATE} y diagnÃ³stico elÃ©ctrico industrial con mÃ©todo: checklist, verificaciÃ³n final y handoff documentado en cada visita.`,
      responseNote: `Modelo de trabajo: primero diagnÃ³stico en planta â†’ luego intervenciÃ³n con alcance claro. Base: ${BASE}${TRASLADO_TEXT}. Cobertura AMBA (prioridad GBA Norte).`,
      primaryCta: {
        label: 'Coordinar diagnÃ³stico por WhatsApp',
        action: 'whatsapp',
        href: WHATSAPP_URL
      },
      secondaryCta: {
        label: 'Ver servicios',
        href: '#servicios'
      },
      benefits: [
        {
          title: 'DiagnÃ³stico como primer paso',
          text: `DiagnÃ³stico tÃ©cnico en planta (hasta 2 horas): ${LISTA_DIAG_2H}. Incluye registro e informe breve con hallazgos y prÃ³ximos pasos.`,
          variant: 'success'
        },
        {
          title: 'EjecuciÃ³n presentable para terceros (B2B2B)',
          text: 'Trabajo prolijo y documentado, ideal para proveedores e integradores que necesitan evidencias, checklist y cierre tÃ©cnico claro.',
          variant: 'primary'
        },
        {
          title: 'Seguridad primero',
          text: 'Si no hay condiciones para intervenir con seguridad, se documenta, se propone adecuaciÃ³n mÃ­nima con tablero desenergizado y se reprograma.',
          variant: 'warning'
        }
      ],
      image: {
        src: heroIllustration,
        alt: 'IlustraciÃ³n de mediciÃ³n industrial y diagnÃ³stico elÃ©ctrico',
        width: 420,
        height: 320
      }
    },

    services: {
      title: 'Servicios',
      cards: [
        {
          id: 'instalacion',
          title: `InstalaciÃ³n industrial de 1 equipo (${POWERMETER} o ${AUTOMATE}) (equipo provisto por el cliente)`,
          description: `Relevamos el tablero, instalamos el ${POWERMETER}/${AUTOMATE} y dejamos la mediciÃ³n/funciÃ³n operativa con verificaciÃ³n final y documentaciÃ³n.`,
          subtitle: 'Incluye',
          media: {
            src: installTools,
            alt: 'IlustraciÃ³n de herramientas e instalaciÃ³n tÃ©cnica',
            width: 140,
            height: 120
          },
          items: [
            'Relevamiento del tablero: accesibilidad, punto de instalaciÃ³n, protecciones y condiciones de seguridad.',
            `InstalaciÃ³n del ${POWERMETER}/${AUTOMATE} + verificaciÃ³n de lectura/funciÃ³n de referencia.`,
            'Registro y documentaciÃ³n: fotos del tablero/punto de instalaciÃ³n + checklist tÃ©cnico.',
            'Tiempo tÃ­pico: media jornada (aprox. 4 horas) cuando hay acceso, tablero intervenible en condiciones seguras y ventana para desenergizar si aplica.'
          ],
          figure: {
            src: powermeter,
            alt: `IlustraciÃ³n de medidor ${POWERMETER}`,
            width: 220,
            height: 140,
            caption: `Precio: ${CONSULTAR}. Traslado segÃºn distancia desde ${BASE}${TRASLADO_TEXT}. Equipo provisto por el cliente.`
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
          title: 'DiagnÃ³stico tÃ©cnico en planta (hasta 2 horas)',
          description:
            'DiagnÃ³stico en campo para fallas intermitentes o crÃ­ticas: mediciÃ³n, prueba, aislamiento del problema y propuesta de correcciÃ³n.',
          subtitle: 'Resultado',
          media: {
            src: analyticsDashboard,
            alt: 'IlustraciÃ³n de diagnÃ³stico tÃ©cnico y mediciones',
            width: 160,
            height: 140
          },
          items: [
            'DiagnÃ³stico con instrumental y mÃ©todo de descarte.',
            'IdentificaciÃ³n de causa probable y plan de correcciÃ³n (inmediato o programado).',
            'Registro de hallazgos + recomendaciones para prevenir recurrencia.'
          ],
          note: `Precio de lista: ${LISTA_DIAG_2H} (hasta 2 horas). ${DIAG_EXCEDENTE_TEXT} ${DIAG_COTIZADOR_NOTE} Seguridad primero: si el tablero no permite intervenir con seguridad, se documenta y se reprograma.`,
          figure: {
            src: analyticsDashboard,
            alt: 'IlustraciÃ³n de mediciones y checklist',
            width: 160,
            height: 140,
            caption: 'Cobertura AMBA (prioridad GBA Norte). CoordinaciÃ³n por WhatsApp.'
          },
          cta: {
            label: 'Coordinar diagnÃ³stico por WhatsApp',
            action: 'whatsapp',
            href: WHATSAPP_URL,
            section: 'servicios-diagnostico'
          }
        }
      ]
    },

    profile: {
      title: 'Perfil tÃ©cnico',
      bullets: [
        'Servicios industriales con foco en seguridad, trazabilidad y documentaciÃ³n.',
        'FormaciÃ³n: TÃ©cnico ElectrÃ³nico Â· TÃ©c. Univ. en Mantenimiento Industrial Â· Estudiante de Lic. en IA y RobÃ³tica.',
        'Enfoque de trabajo: checklist, verificaciÃ³n de funcionamiento, registro de cambios y handoff.'
      ]
    },

    about: {
      title: `Sobre ${BRAND_NAME}`,
      paragraphs: [
        `${BRAND_NAME} brinda servicios tÃ©cnicos para industria: diagnÃ³stico elÃ©ctrico, instalaciÃ³n de ${POWERMETER}/${AUTOMATE} y asistencia en campo con criterio operativo.`,
        `Base operativa: ${BASE}. Cobertura: AMBA (prioridad GBA Norte). Fuera de AMBA: consultar.`,
        'Oferta ampliada para industria grÃ¡fica: mantenimiento y reparaciÃ³n de maquinaria en alcance elÃ©ctrico/electrÃ³nico y control (sin mecÃ¡nica), con decisiones tÃ©cnicas basadas en datos reales.'
      ],
      image: {
        src: teamTraining,
        alt: 'IlustraciÃ³n de formaciÃ³n tÃ©cnica y equipo de trabajo',
        width: 240,
        height: 180
      }
    },

    navbar: {
      brand: BRAND_NAME,
      brandAriaLabel: BRAND_ARIA_LABEL,
      links: [
        { label: 'Servicios', href: '#servicios' },
        { label: 'Perfil', href: '#perfil' },
        { label: 'Contacto', href: '#contacto' }
      ],
      contactLabel: 'WhatsApp'
    },

    footer: {
      note: `Base: ${BASE} Â· AMBA (prioridad GBA Norte) Â· DiagnÃ³stico en planta Â· InstalaciÃ³n ${POWERMETER}/${AUTOMATE} Â· DocumentaciÃ³n y handoff`
    },

    legal: {
      text: `${BRAND_NAME} compite por criterio tÃ©cnico: primero se realiza un diagnÃ³stico en planta para definir alcance, riesgos y prÃ³ximos pasos. El Ãºnico precio publicado es el DiagnÃ³stico tÃ©cnico en planta (hasta 2 horas): ${LISTA_DIAG_2H}. Si el backend no estÃ¡ disponible, el sitio mostrarÃ¡ "${CONSULTAR}". El precio mostrado es de lista y el cotizador puede aplicar descuentos si se cumplen condiciones operativas (por ejemplo: turno programado, acceso listo, baja burocracia, ventana segura confirmada). Excedentes y trabajos de intervenciÃ³n se cotizan segÃºn alcance. Seguridad primero: si al llegar no estÃ¡n dadas las condiciones seguras (acceso, permisos, ventana, desenergizaciÃ³n cuando aplica), se documenta el estado y se reprograma. El traslado se coordina segÃºn distancia desde ${BASE}${TRASLADO_TEXT}. En casos particulares que requieran intervenciÃ³n o firmas habilitantes, se coordina con profesional matriculado. Las cookies de analÃ­tica (GA4 y Clarity) se habilitan Ãºnicamente tras tu consentimiento explÃ­cito.`
    },

    contact: {
      title: 'Contacto',
      subtitle:
        'Dejanos tu email y consulta para seguimiento comercial, o escribinos por WhatsApp si necesitÃ¡s coordinaciÃ³n rÃ¡pida.',
      labels: {
        email: 'Correo electrÃ³nico',
        message: 'Mensaje'
      },
      submitLabel: 'Registrar consulta',
      checkingMessage: 'Registrando tu consulta...',
      unavailableMessage:
        'El formulario estÃ¡ temporalmente en mantenimiento. Escribinos por WhatsApp para coordinar una respuesta rÃ¡pida.',
      successMessage: 'Â¡Listo! Registramos tu consulta. Te vamos a responder a la brevedad (dÃ­as hÃ¡biles).',
      errorMessage: 'No se pudo registrar la consulta. IntentÃ¡ nuevamente mÃ¡s tarde.',
      unexpectedErrorMessage: 'OcurriÃ³ un error inesperado. IntentÃ¡ nuevamente mÃ¡s tarde.'
    },

    consent: {
      title: 'Usamos cookies para analÃ­tica',
      description:
        'AceptÃ¡ para habilitar Google Analytics 4 y Microsoft Clarity. PodÃ©s revisar los detalles en la secciÃ³n legal del sitio.',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Rechazar'
    }
  }
}
