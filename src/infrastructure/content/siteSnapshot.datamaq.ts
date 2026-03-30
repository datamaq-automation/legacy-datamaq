import type { SiteSnapshot } from '@/domain/types/site'

export const datamaqSiteSnapshot: SiteSnapshot = {
  content: {
    hero: {
      badge: 'Instalacion e integracion Powermeter + Automate',
      title: 'Monitoreo energetico y automatizacion con Powermeter y Automate',
      subtitle:
        'Instalacion en tablero, integracion a Powermate o SCADA y puesta en marcha para industria, edificios y cooperativas.',
      responseNote: 'Base operativa: Garin (GBA Norte). Relevamiento inicial y alcance por WhatsApp.',
      primaryCta: {
        label: 'Escribir por WhatsApp',
        href: 'https://wa.me/5491156297160',
        action: 'whatsapp'
      },
      secondaryCta: {
        label: 'Ver solucion',
        href: '#servicios',
        action: 'services'
      },
      benefits: [
        {
          title: 'Medicion util',
          text: 'Variables electricas y tendencias para entender como responde la instalacion.',
          variant: 'primary'
        },
        {
          title: 'Automatizacion aplicada',
          text: 'Logicas de control e integracion para actuar con criterio operativo.',
          variant: 'success'
        },
        {
          title: 'Puesta en marcha',
          text: 'Configuracion, verificacion final y registro tecnico basico.',
          variant: 'warning'
        }
      ],
      image: {
        src: '/media/hero-energy.svg',
        alt: 'Monitoreo energetico y automatizacion en tablero industrial',
        width: 900,
        height: 700
      }
    },
    services: {
      title: 'Solucion Powermeter + Automate',
      cards: [
        {
          id: 'powermeter',
          title: 'Powermeter',
          description:
            'Instalacion y configuracion de medicion electrica inteligente para tablero, linea o punto critico.',
          subtitle: 'Monitoreo, alertas e integracion',
          media: {
            src: '/media/analytics-dashboard.svg',
            alt: 'Medicion electrica y tablero de datos',
            width: 900,
            height: 700
          },
          items: [
            'Monitoreo remoto de variables electricas',
            'Alertas y seguimiento de desvios',
            'Integracion a Powermate o SCADA'
          ],
          figure: {
            src: '/media/analytics-dashboard.svg',
            alt: 'Visualizacion de datos energeticos',
            width: 900,
            height: 700,
            caption: 'Aplicable a tableros generales, lineas, edificios y puntos de consumo relevantes.'
          },
          cta: {
            label: 'Consultar medicion',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        },
        {
          id: 'automate',
          title: 'Automate',
          description:
            'Implementacion de controlador para automatizacion, logica de demanda e integracion con senales y sistemas.',
          subtitle: 'Control y digitalizacion operativa',
          media: {
            src: '/media/install-tools.svg',
            alt: 'Controlador y automatizacion en tablero',
            width: 900,
            height: 700
          },
          items: [
            'Logicas locales y remotas',
            'Integracion por MQTT, Modbus y HTTP',
            'Control de demanda y automatizacion'
          ],
          note: 'La logica final depende del relevamiento, senales disponibles y objetivo operativo.',
          cta: {
            label: 'Consultar automatizacion',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        },
        {
          id: 'integracion',
          title: 'Integracion y puesta en marcha',
          description:
            'Relevamiento, montaje, parametrizacion, pruebas y cierre tecnico sobre la solucion Powermeter + Automate.',
          subtitle: 'Del tablero a la operacion',
          media: {
            src: '/media/team-training.svg',
            alt: 'Puesta en marcha y acompanamiento tecnico',
            width: 900,
            height: 700
          },
          items: [
            'Relevamiento inicial y checklist',
            'Configuracion y pruebas de funcionamiento',
            'Entrega tecnica con observaciones y proximos pasos'
          ],
          cta: {
            label: 'Coordinar relevamiento',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        }
      ]
    },
    about: {
      title: 'Sobre DataMaq',
      paragraphs: [
        'DataMaq implementa soluciones de monitoreo energetico y automatizacion aplicada con foco en continuidad operativa, medicion util y decisiones tecnicas claras.',
        'Cada intervencion prioriza tablero ordenado, integracion real con la operacion, documentacion minima y verificacion final.'
      ],
      image: {
        src: '/media/tecnico-a-cargo.webp',
        alt: 'Tecnico a cargo de la implementacion',
        width: 700,
        height: 933
      }
    },
    profile: {
      title: 'Perfil tecnico',
      bullets: [
        'Relevamiento en sitio y criterio de implementacion.',
        'Instalacion, integracion y puesta en marcha.',
        'Acompanamiento posterior para estabilizar la solucion.'
      ]
    },
    navbar: {
      brand: 'DataMaq',
      brandAriaLabel: 'DataMaq, inicio',
      links: [
        { label: 'Solucion', href: '#servicios' },
        { label: 'Proceso', href: '#proceso' },
        { label: 'Alcance', href: '#tarifas' },
        { label: 'Cobertura', href: '#cobertura' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contacto', href: '#contacto' }
      ],
      contactLabel: 'Contactar'
    },
    footer: {
      note: 'DataMaq | Garin (GBA Norte)'
    },
    legal: {
      text: 'La informacion publicada es referencial y puede actualizarse segun alcance, tablero, conectividad y condiciones de implementacion.'
    },
    contact: {
      title: 'Contacto',
      subtitle:
        'Contanos tu tablero, objetivo y zona. Te respondemos con el siguiente paso para Powermeter, Automate o integracion.',
      labels: {
        email: 'Email',
        message: 'Mensaje'
      },
      submitLabel: 'Enviar',
      checkingMessage: 'Verificando disponibilidad del backend...',
      unavailableMessage: 'Servicio temporalmente no disponible.',
      successMessage: 'Mensaje enviado. Gracias por contactarte.',
      errorMessage: 'No se pudo enviar. Intentalo nuevamente.',
      unexpectedErrorMessage: 'Ocurrio un error inesperado.'
    },
    consent: {
      title: 'Privacidad',
      description: 'Usamos analitica basica para mejorar la experiencia y el seguimiento de consultas.',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Rechazar'
    },
    decisionFlow: {
      processTitle: 'Como trabajamos',
      processStepPrefixLabel: 'Paso',
      pricingTitle: 'Alcance del servicio',
      pricingSummaryFallback:
        'El alcance depende del tablero, cantidad de mediciones, conectividad disponible y objetivo de automatizacion.',
      pricingIncludesTitle: 'Incluye',
      pricingIncludes: [
        'Relevamiento inicial y checklist tecnico.',
        'Instalacion y configuracion basica de Powermeter o Automate segun propuesta.',
        'Integracion inicial a Powermate o sistema tercero si el alcance lo contempla.',
        'Verificacion final y registro tecnico basico de la intervencion.'
      ],
      pricingExcludesTitle: 'No incluye',
      pricingExcludes: [
        'Equipos, sensores o accesorios si no fueron cotizados en la propuesta.',
        'Adecuaciones electricas mayores del tablero.',
        'Desarrollo de logica avanzada, tableros nuevos o integracion extensa no prevista en el alcance inicial.'
      ],
      pricingVariablesTitle: 'Puede variar por',
      pricingVariables: [
        'Cantidad de circuitos, senales o puntos a relevar.',
        'Conectividad disponible y necesidad de integracion con terceros.',
        'Condiciones de seguridad, accesibilidad y criticidad operativa.'
      ],
      coverageTitle: 'Cobertura y tiempos',
      coverageAreasTitle: 'Zona',
      coverageAreas: [
        'Cobertura prioritaria en GBA Norte.',
        'AMBA sujeto a agenda y viabilidad tecnica.',
        'Interior con coordinacion previa.'
      ],
      responseTimesTitle: 'Tiempo de respuesta',
      responseTimes: [
        'Respuesta comercial en menos de 24 horas.',
        'Agenda de relevamiento segun criticidad y disponibilidad.',
        'Intervenciones urgentes con coordinacion previa.'
      ],
      whatsappLabel: 'Pedir coordinacion por WhatsApp',
      contactFormLabel: 'Ir al formulario de contacto',
      faqTitle: 'Preguntas frecuentes',
      processSteps: [
        {
          order: 1,
          title: 'Relevamiento y objetivo operativo',
          description:
            'Revisamos tablero, conectividad, variables a medir y objetivo de control para definir una implementacion razonable.'
        },
        {
          order: 2,
          title: 'Instalacion y configuracion',
          description:
            'Montamos Powermeter y/o Automate, configuramos comunicacion e integracion inicial segun el alcance acordado.'
        },
        {
          order: 3,
          title: 'Pruebas y validacion',
          description:
            'Verificamos lecturas, comunicaciones, logica basica y condiciones minimas de funcionamiento antes del cierre.'
        },
        {
          order: 4,
          title: 'Cierre tecnico y proximos pasos',
          description:
            'Entregamos observaciones, pendientes y recomendaciones para estabilizar la solucion y seguir escalando.'
        }
      ],
      faqItems: [
        {
          question: 'Que hace Powermeter?',
          answer:
            'Permite medir variables electricas, ver tendencias, detectar desvios e integrar la informacion con Powermate o sistemas de terceros.'
        },
        {
          question: 'Que hace Automate?',
          answer:
            'Permite ejecutar logicas de automatizacion, control e integracion sobre senales y equipos segun el objetivo operativo definido.'
        },
        {
          question: 'Powermeter corrige directamente el factor de potencia?',
          answer:
            'No por si solo. Sirve para medir, entender el comportamiento de la instalacion y tomar mejores decisiones de control o correccion.'
        },
        {
          question: 'Pueden integrarlo con Powermate o SCADA?',
          answer:
            'Si. El alcance exacto depende del equipo elegido, la conectividad disponible y el sistema al que haya que vincularse.'
        },
        {
          question: 'Que necesitas para cotizar rapido?',
          answer:
            'Zona, fotos del tablero, objetivo del proyecto y una breve descripcion de que queres medir, controlar o automatizar.'
        }
      ]
    },
    thanks: {
      badge: 'Formulario enviado',
      topbarTitle: 'Solicitud finalizada',
      title: 'Gracias!',
      subtitle: 'Recibimos tu consulta. En breve te contactamos.',
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
      servicesIntro: 'Soluciones tecnicas orientadas a tablero, monitoreo, integracion y puesta en marcha.',
      faqEyebrow: 'Ayuda',
      faqTitle: 'Preguntas frecuentes',
      quickLinks: {
        services: 'Explorar solucion',
        profile: 'Ver perfil tecnico'
      },
      dockLabels: {
        home: 'Inicio',
        services: 'Solucion',
        profile: 'Perfil',
        contact: 'Contacto'
      },
      primaryContactForm: {
        title: 'Inicia tu proyecto',
        subtitle: 'Dejanos tus datos y te contactamos en menos de 24 horas.',
        submitLabel: 'Enviar solicitud'
      }
    },
    contactPage: {
      eyebrow: 'Contacto',
      homeButtonLabel: 'Inicio',
      supportTitle: 'Canales disponibles',
      supportItems: [
        'Formulario principal para consultas tecnicas y comerciales.',
        'WhatsApp directo para coordinacion rapida cuando este habilitado.'
      ],
      supportBackHomeLabel: 'Volver al inicio',
      introLinks: {
        services: 'Solucion',
        profile: 'Perfil tecnico',
        faq: 'FAQ'
      },
      primaryFormSubmitLabel: 'Enviar solicitud'
    }
  },
  brand: {
    brandId: 'datamaq',
    brandName: 'DataMaq',
    brandAriaLabel: 'DataMaq, inicio',
    baseOperativa: 'Garin (GBA Norte)',
    contactEmail: 'info@datamaq.com.ar',
    contactFormActive: true,
    whatsappUrl: 'https://wa.me/5491156297160',
    whatsappQr: {
      phoneE164: '5491156297160',
      message: 'Hola, te contacto por DataMaq. Quiero coordinar una implementacion con Powermeter y/o Automate.',
      sourceTag: 'qr_card'
    },
    technician: {
      name: 'Agustin Bustos',
      role: 'Tecnico a cargo',
      photo: {
        src: '/media/tecnico-a-cargo.webp',
        alt: 'Foto del tecnico a cargo',
        width: 100,
        height: 100
      },
      whatsappLabel: 'Coordinar por WhatsApp',
      unavailableLabel: 'Contacto no disponible'
    },
    equipmentNames: {
      medidorNombre: 'Powermeter',
      automateNombre: 'Automate'
    }
  },
  seo: {
    siteUrl: 'https://datamaq.com.ar',
    siteName: 'DataMaq',
    siteDescription:
      'Instalacion, integracion y puesta en marcha de Powermeter y Automate para monitoreo energetico y automatizacion aplicada en AMBA.',
    siteOgImage: 'https://datamaq.com.ar/og-default.png',
    siteLocale: 'es_AR',
    business: {
      name: 'DataMaq',
      email: 'info@datamaq.com.ar',
      country: 'AR',
      areaServed: ['GBA Norte', 'AMBA', 'Argentina']
    }
  }
}
