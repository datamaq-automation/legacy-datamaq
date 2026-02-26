import type { AppContent, CommercialConfig } from '@/domain/types/content'
import { activeRuntimeProfile } from '@/infrastructure/content/runtimeProfile'

import heroEnergy from '@/assets/hero-energy.svg'
import installTools from '@/assets/install-tools.svg'
import analyticsDashboard from '@/assets/analytics-dashboard.svg'
import teamTraining from '@/assets/team-training.svg'
import tecnicoACargo from '@/assets/tecnico-a-cargo.webp'

const { brandName, brandAriaLabel, baseOperativa, whatsappUrl } = activeRuntimeProfile

export const commercialConfig: CommercialConfig = {
  brandName,
  brandAriaLabel,
  baseOperativa,
  whatsappUrl: whatsappUrl ?? 'https://wa.me/5491100000000',
  ...activeRuntimeProfile.commercialConfig
}

export function buildAppContent(config: CommercialConfig): AppContent {
  const diagnosticListNote =
    typeof config.visitaDiagnosticoHasta2hARS === 'number'
      ? `Diagnostico en lista: ARS ${formatArs(config.visitaDiagnosticoHasta2hARS)}.`
      : 'Diagnostico en lista: Consultar al WhatsApp.'

  return {
    hero: {
      badge: `Servicio tecnico ${config.brandName}`,
      title: 'Diagnostico e instalacion electrica para pymes',
      subtitle: 'Levantamiento en campo, medicion y plan de accion con criterios operativos.',
      responseNote: `Base operativa: ${config.baseOperativa}. Valores de referencia: Consultar al WhatsApp.`,
      primaryCta: {
        label: 'Escribir por WhatsApp',
        href: config.whatsappUrl,
        action: 'whatsapp'
      },
      secondaryCta: {
        label: 'Ver servicios',
        href: '#servicios',
        action: 'services'
      },
      benefits: [
        { title: 'Diagnostico inicial', text: 'Relevamiento tecnico y prioridades.', variant: 'primary' },
        { title: 'Implementacion', text: 'Ejecucion por etapas con trazabilidad.', variant: 'success' },
        { title: 'Seguimiento', text: 'Control de resultados y ajustes.', variant: 'warning' }
      ],
      image: { src: heroEnergy, alt: 'Energia y tablero industrial', width: 900, height: 700 }
    },
    services: {
      title: 'Servicios',
      cards: [
        {
          id: 'instalacion',
          title: 'Instalacion y adecuacion',
          description: 'Montaje, recambio y ordenamiento de tableros.',
          subtitle: 'Estandarizacion tecnica',
          media: { src: installTools, alt: 'Herramientas de instalacion', width: 900, height: 700 },
          items: ['Tableros y protecciones', 'Cableado y etiquetado', 'Puesta en servicio'],
          figure: {
            src: installTools,
            alt: 'Referencia comercial',
            width: 900,
            height: 700,
            caption: 'Referencia comercial: Consultar al WhatsApp.'
          },
          cta: { label: 'Consultar', href: '#contacto', action: 'contact', section: 'contacto' }
        },
        {
          id: 'medicion',
          title: 'Medicion y diagnostico',
          description: 'Medicion de consumo y deteccion de desbalances.',
          subtitle: `Instrumentacion: ${config.equipos.medidorNombre}`,
          media: { src: analyticsDashboard, alt: 'Panel de medicion', width: 900, height: 700 },
          items: ['Perfil de carga', 'Eventos y anomalias', 'Informe accionable'],
          note: diagnosticListNote,
          cta: { label: 'Solicitar diagnostico', href: '#contacto', action: 'contact', section: 'contacto' }
        },
        {
          id: 'capacitacion',
          title: 'Capacitacion operativa',
          description: 'Transferencia de criterios para operacion diaria.',
          subtitle: 'Procedimientos de campo',
          media: { src: teamTraining, alt: 'Capacitacion de equipo', width: 900, height: 700 },
          items: ['Rutinas de control', 'Lectura de indicadores', 'Buenas practicas'],
          cta: { label: 'Coordinar', href: '#contacto', action: 'contact', section: 'contacto' }
        }
      ]
    },
    about: {
      title: `Sobre ${config.brandName}`,
      paragraphs: [
        'Trabajo orientado a continuidad operativa y decisiones tecnicas claras.',
        'Cada intervencion prioriza seguridad, orden documental y resultados medibles.'
      ],
      image: { src: tecnicoACargo, alt: 'Tecnico a cargo', width: 700, height: 933 }
    },
    profile: {
      title: 'Perfil tecnico',
      bullets: [
        'Diagnostico en sitio y plan de mejora.',
        'Implementacion por etapas.',
        'Acompanamiento posterior a la puesta en marcha.'
      ]
    },
    navbar: {
      brand: config.brandName,
      brandAriaLabel: config.brandAriaLabel,
      links: [
        { label: 'Servicios', href: '#servicios' },
        { label: 'Proceso', href: '#proceso' },
        { label: 'Tarifas', href: '#tarifas' },
        { label: 'Cobertura', href: '#cobertura' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contacto', href: '#contacto' }
      ],
      contactLabel: 'Contactar'
    },
    footer: {
      note: `${config.brandName} | ${config.baseOperativa}`
    },
    legal: {
      text: 'La informacion publicada es referencial y puede actualizarse sin previo aviso.'
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Contanos tu necesidad y te respondemos con un plan de accion.',
      labels: { email: 'Email', message: 'Mensaje' },
      submitLabel: 'Enviar',
      checkingMessage: 'Verificando disponibilidad del backend...',
      unavailableMessage: 'Servicio temporalmente no disponible.',
      successMessage: 'Mensaje enviado. Gracias por contactarte.',
      errorMessage: 'No se pudo enviar. Intentalo nuevamente.',
      unexpectedErrorMessage: 'Ocurrio un error inesperado.'
    },
    consent: {
      title: 'Privacidad',
      description: 'Usamos analitica para mejorar la experiencia.',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Rechazar'
    }
  }
}

function formatArs(amount: number): string {
  return new Intl.NumberFormat('es-AR').format(amount)
}
