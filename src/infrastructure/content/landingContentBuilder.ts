/*
Path: src/infrastructure/content/landingContentBuilder.ts
*/

import type { AppContent, CommercialConfig } from '@/domain/types/content'

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
      image: { src: '/media/hero-energy.svg', alt: 'Energia y tablero industrial', width: 900, height: 700 }
    },
    services: {
      title: 'Contenido',
      cards: [
        {
          id: 'placeholder-1',
          title: 'Bloque temporal',
          description: 'Este contenido sera provisto por backend.',
          subtitle: 'Pendiente de sincronizacion',
          media: { src: '/media/install-tools.svg', alt: 'Herramientas de instalacion', width: 900, height: 700 },
          items: ['Esperando payload', 'Esperando payload', 'Esperando payload'],
          figure: {
            src: '/media/install-tools.svg',
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
          media: { src: '/media/analytics-dashboard.svg', alt: 'Panel de medicion', width: 900, height: 700 },
          items: ['Esperando payload', 'Esperando payload', 'Esperando payload'],
          note: diagnosticListNote,
          cta: { label: 'Contactar', href: '#contacto', action: 'contact', section: 'contacto' }
        },
        {
          id: 'placeholder-3',
          title: 'Bloque temporal',
          description: 'Este contenido sera provisto por backend.',
          subtitle: 'Pendiente de sincronizacion',
          media: { src: '/media/team-training.svg', alt: 'Capacitacion de equipo', width: 900, height: 700 },
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
      image: { src: '/media/tecnico-a-cargo.webp', alt: 'Tecnico a cargo', width: 700, height: 933 }
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
      labels: {
        firstName: 'Nombre',
        lastName: 'Apellido',
        company: 'Empresa',
        email: 'E-mail',
        phone: 'Nro telefono',
        geographicLocation: 'Ubicacion geografica',
        comment: 'Comentario',
        message: 'Comentario'
      },
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
      processStepPrefixLabel: 'Paso',
      pricingTitle: 'Tarifa base y alcance',
      pricingSummaryFallback: 'Contenido temporal.',
      pricingIncludesTitle: 'Incluye',
      pricingIncludes: ['Contenido temporal.'],
      pricingExcludesTitle: 'No incluye',
      pricingExcludes: ['Contenido temporal.'],
      pricingVariablesTitle: 'Puede variar por',
      pricingVariables: ['Contenido temporal.'],
      coverageTitle: 'Cobertura y tiempos',
      coverageAreasTitle: 'Zona',
      coverageAreas: ['Contenido temporal.'],
      responseTimesTitle: 'Tiempo de respuesta',
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
      topbarTitle: 'Solicitud finalizada',
      title: 'Gracias!',
      subtitle: 'Recibimos tu consulta.',
      whatsappButtonLabel: 'Escribir por WhatsApp',
      goHomeButtonLabel: 'Volver al inicio',
      closeButtonAriaLabel: 'Volver al inicio'
    },
    homePage: {
      headerContactLabel: 'Contacto',
      heroFallbackContactLabel: 'Iniciar contacto',
      heroMediaLabel: 'Cobertura tecnica activa',
      trustTitle: 'Senales de confianza',
      trustLogos: [],
      profileEyebrow: 'Perfil profesional',
      profileName: 'Agustin Bustos',
      profileWhatsappLabel: 'Contacto directo por WhatsApp',
      profileFormLabel: 'Ir al formulario',
      profileSectionLabel: 'Enfoque tecnico',
      servicesEyebrow: 'Servicios',
      servicesIntro: 'Soluciones tecnicas orientadas a planta, mantenimiento y mejora continua.',
      faqEyebrow: 'Ayuda',
      faqTitle: 'Preguntas frecuentes',
      quickLinks: {
        services: 'Explorar servicios',
        profile: 'Ver perfil tecnico'
      },
      dockLabels: {
        home: 'Inicio',
        services: 'Servicios',
        profile: 'Perfil',
        contact: 'Contacto'
      },
      primaryContactForm: {
        title: 'Inicia tu proyecto',
        subtitle: 'Dejanos tus datos y te contactamos en menos de 24 horas.',
        submitLabel: 'Enviar solicitud'
      },
      secondaryEmailForm: {
        title: 'Canal alternativo por email',
        subtitle: 'Si preferis correo, tambien podes enviarnos tu consulta por este canal.',
        submitLabel: 'Enviar por email'
      }
    },
    contactPage: {
      eyebrow: 'Contacto',
      homeButtonLabel: 'Inicio',
      supportTitle: 'Canales disponibles',
      supportItems: [
        'Formulario principal para consultas tecnicas y comerciales.',
        'Canal alternativo por email si preferis seguimiento asincronico.',
        'WhatsApp directo para coordinacion rapida cuando este habilitado.'
      ],
      supportBackHomeLabel: 'Volver al inicio',
      introLinks: {
        services: 'Servicios',
        profile: 'Perfil tecnico',
        faq: 'FAQ'
      },
      primaryFormSubmitLabel: 'Enviar solicitud',
      secondaryEmailForm: {
        title: 'Canal alternativo por email',
        subtitle: 'Si preferis correo, tambien podes enviarnos tu consulta por este canal.',
        submitLabel: 'Enviar por email'
      }
    }
  }
}
