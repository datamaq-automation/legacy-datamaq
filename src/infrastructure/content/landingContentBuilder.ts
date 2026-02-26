/*
Path: src/infrastructure/content/landingContentBuilder.ts
*/

import type { AppContent, CommercialConfig } from '@/domain/types/content'

import heroEnergy from '@/assets/hero-energy.svg'
import installTools from '@/assets/install-tools.svg'
import analyticsDashboard from '@/assets/analytics-dashboard.svg'
import teamTraining from '@/assets/team-training.svg'
import tecnicoACargo from '@/assets/tecnico-a-cargo.webp'

export function buildLandingAppContent(config: CommercialConfig): AppContent {
  const diagnosticListNote = 'Contenido no disponible temporalmente.'

  return {
    hero: {
      badge: `Servicio tecnico ${config.brandName}`,
      title: 'Contenido no disponible',
      subtitle: 'Estamos actualizando la informacion de esta landing.',
      responseNote: `Base operativa: ${config.baseOperativa}.`,
      primaryCta: {
        label: 'Contactar',
        href: config.whatsappUrl,
        action: 'whatsapp'
      },
      secondaryCta: {
        label: 'Ver estado',
        href: '#servicios',
        action: 'services'
      },
      benefits: [
        { title: 'Sincronizacion', text: 'Esperando contenido remoto.', variant: 'primary' },
        { title: 'Integridad', text: 'Validando contrato de contenido.', variant: 'success' },
        { title: 'Estado', text: 'Mostrando fallback tecnico.', variant: 'warning' }
      ],
      image: { src: heroEnergy, alt: 'Energia y tablero industrial', width: 900, height: 700 }
    },
    services: {
      title: 'Contenido',
      cards: [
        {
          id: 'placeholder-1',
          title: 'Bloque temporal',
          description: 'Este contenido sera provisto por backend.',
          subtitle: 'Pendiente de sincronizacion',
          media: { src: installTools, alt: 'Herramientas de instalacion', width: 900, height: 700 },
          items: ['Esperando payload', 'Esperando payload', 'Esperando payload'],
          figure: {
            src: installTools,
            alt: 'Referencia comercial',
            width: 900,
            height: 700,
            caption: 'Contenido temporal.'
          },
          cta: { label: 'Contactar', href: '#contacto', action: 'contact', section: 'contacto' }
        },
        {
          id: 'placeholder-2',
          title: 'Bloque temporal',
          description: 'Este contenido sera provisto por backend.',
          subtitle: `Instrumentacion: ${config.equipos.medidorNombre}`,
          media: { src: analyticsDashboard, alt: 'Panel de medicion', width: 900, height: 700 },
          items: ['Esperando payload', 'Esperando payload', 'Esperando payload'],
          note: diagnosticListNote,
          cta: { label: 'Contactar', href: '#contacto', action: 'contact', section: 'contacto' }
        },
        {
          id: 'placeholder-3',
          title: 'Bloque temporal',
          description: 'Este contenido sera provisto por backend.',
          subtitle: 'Pendiente de sincronizacion',
          media: { src: teamTraining, alt: 'Capacitacion de equipo', width: 900, height: 700 },
          items: ['Esperando payload', 'Esperando payload', 'Esperando payload'],
          cta: { label: 'Contactar', href: '#contacto', action: 'contact', section: 'contacto' }
        }
      ]
    },
    about: {
      title: `Sobre ${config.brandName}`,
      paragraphs: [
        'Contenido temporal de fallback.',
        'Este bloque se reemplaza por backend.'
      ],
      image: { src: tecnicoACargo, alt: 'Tecnico a cargo', width: 700, height: 933 }
    },
    profile: {
      title: 'Perfil',
      bullets: [
        'Contenido temporal.',
        'Esperando backend.',
        'Sincronizacion pendiente.'
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
      text: 'Contenido temporal.'
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Formulario disponible mientras se sincroniza contenido.',
      labels: { email: 'Email', message: 'Mensaje' },
      submitLabel: 'Enviar',
      checkingMessage: 'Verificando backend...',
      unavailableMessage: 'Servicio temporalmente no disponible.',
      successMessage: 'Mensaje enviado. Gracias por contactarte.',
      errorMessage: 'No se pudo enviar. Intentalo nuevamente.',
      unexpectedErrorMessage: 'Ocurrio un error inesperado.'
    },
    consent: {
      title: 'Privacidad',
      description: 'Configuracion temporal de consentimiento.',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Rechazar'
    },
    decisionFlow: {
      processTitle: 'Como trabajamos',
      pricingTitle: 'Tarifa base y alcance',
      pricingSummaryFallback: 'Contenido temporal.',
      pricingIncludes: ['Contenido temporal.'],
      pricingExcludes: ['Contenido temporal.'],
      pricingVariables: ['Contenido temporal.'],
      coverageTitle: 'Cobertura y tiempos',
      coverageAreas: ['Contenido temporal.'],
      responseTimes: ['Contenido temporal.'],
      whatsappLabel: 'Pedir coordinacion por WhatsApp',
      contactFormLabel: 'Ir al formulario de contacto',
      faqTitle: 'Preguntas frecuentes',
      processSteps: [
        { order: 1, title: 'Paso 1', description: 'Contenido temporal.' },
        { order: 2, title: 'Paso 2', description: 'Contenido temporal.' }
      ],
      faqItems: [{ question: 'Pregunta temporal', answer: 'Respuesta temporal.' }]
    },
    thanks: {
      badge: 'Formulario enviado',
      title: 'Gracias!',
      subtitle: 'Recibimos tu consulta.',
      whatsappButtonLabel: 'Escribir por WhatsApp',
      goHomeButtonLabel: 'Volver al inicio'
    }
  }
}
