import type { SiteSnapshot } from '@/domain/types/site'

export const datamaqSiteSnapshot: SiteSnapshot = {
  content: {
    hero: {
      badge: 'Automatización, monitoreo y ciencia de datos aplicada',
      title: 'Automatización industrial y ciencia de datos para decisiones operativas',
      subtitle:
        'Implementación de Powermeter y Automate, más asesoramiento y capacitaciones en Python, NumPy, pandas, bases de datos, APIs y Matplotlib.',
      responseNote:
        'Base operativa: Garín (GBA Norte). Relevamiento inicial y alcance por WhatsApp. Capacitaciones y asesoramiento también en formato remoto.',
      primaryCta: {
        label: 'Escribime por WhatsApp',
        href: 'https://wa.me/5491156297160',
        action: 'whatsapp'
      },
      secondaryCta: {
        label: 'Mirá la solución',
        href: '#servicios',
        action: 'services'
      },
      benefits: [
        {
          title: 'Medición útil',
          text: 'Variables eléctricas y tendencias para entender cómo responde la instalación.',
          variant: 'primary'
        },
        {
          title: 'Automatización aplicada',
          text: 'Lógicas de control e integración para actuar con criterio operativo.',
          variant: 'success'
        },
        {
          title: 'Ciencia de datos útil',
          text: 'Análisis, automatización y formación para trabajar datos con Python en casos reales.',
          variant: 'warning'
        }
      ],
      image: {
        src: '/media/hero-energy.svg',
        alt: 'Monitoreo energético y automatización en tablero industrial',
        width: 900,
        height: 700
      }
    },
    services: {
      title: 'Servicios técnicos y de ciencia de datos',
      cards: [
        {
          id: 'powermeter',
          title: 'Powermeter',
          description:
            'Instalación y configuración de medición eléctrica inteligente para tablero, línea o punto crítico.',
          subtitle: 'Monitoreo, alertas e integración',
          media: {
            src: '/media/analytics-dashboard.svg',
            alt: 'Medición eléctrica y tablero de datos',
            width: 900,
            height: 700
          },
          items: [
            'Monitoreo remoto de variables eléctricas',
            'Alertas y seguimiento de desvíos',
            'Integración a Powermate o SCADA'
          ],
          figure: {
            src: '/media/analytics-dashboard.svg',
            alt: 'Visualización de datos energéticos',
            width: 900,
            height: 700,
            caption: 'Aplicable a tableros generales, líneas, edificios y puntos de consumo relevantes.'
          },
          cta: {
            label: 'Consultá por medición',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        },
        {
          id: 'automate',
          title: 'Automate',
          description:
            'Implementación de controlador para automatización, lógica de demanda e integración con señales y sistemas.',
          subtitle: 'Control y digitalización operativa',
          media: {
            src: '/media/install-tools.svg',
            alt: 'Controlador y automatización en tablero',
            width: 900,
            height: 700
          },
          items: [
            'Lógicas locales y remotas',
            'Integración por MQTT, Modbus y HTTP',
            'Control de demanda y automatización'
          ],
          note: 'La lógica final depende del relevamiento, señales disponibles y objetivo operativo.',
          cta: {
            label: 'Consultá por automatización',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        },
        {
          id: 'integracion',
          title: 'Integración y puesta en marcha',
          description:
            'Relevamiento, montaje, parametrización, pruebas y cierre técnico sobre la solución Powermeter + Automate.',
          subtitle: 'Del tablero a la operación',
          media: {
            src: '/media/team-training.svg',
            alt: 'Puesta en marcha y acompañamiento técnico',
            width: 900,
            height: 700
          },
          items: [
            'Relevamiento inicial y checklist',
            'Configuración y pruebas de funcionamiento',
            'Entrega técnica con observaciones y próximos pasos'
          ],
          cta: {
            label: 'Coordiná un relevamiento',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        },
        {
          id: 'data-science',
          title: 'Ciencia de datos y capacitación en Python',
          description:
            'Asesoramiento técnico y capacitaciones aplicadas para análisis de datos, automatización y consumo de APIs.',
          subtitle: 'Python para casos reales de negocio y operación',
          media: {
            src: '/media/analytics-dashboard.svg',
            alt: 'Análisis de datos y capacitación en Python',
            width: 900,
            height: 700
          },
          items: [
            'Capacitaciones en Python con NumPy, pandas y Matplotlib',
            'Consultoría sobre bases de datos, APIs y limpieza de datos',
            'Acompañamiento para dashboards, reportes y automatizaciones'
          ],
          note:
            'El enfoque puede ser 100% remoto y se adapta al nivel del equipo, objetivos del negocio y stack disponible.',
          cta: {
            label: 'Consultá por ciencia de datos',
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
        'DataMaq implementa soluciones de monitoreo energético, automatización aplicada y ciencia de datos con foco en continuidad operativa, medición útil y decisiones técnicas claras.',
        'El servicio combina trabajo sobre tableros e integraciones con asesoramiento y capacitaciones prácticas en Python, análisis de datos, bases de datos y APIs.'
      ],
      image: {
        src: '/media/tecnico-a-cargo.webp',
        alt: 'Técnico a cargo de la implementación',
        width: 700,
        height: 933
      }
    },
    profile: {
      title: 'Perfil técnico',
      bullets: [
        'Relevamiento en sitio y criterio de implementación.',
        'Instalación, integración y puesta en marcha.',
        'Asesoramiento y capacitaciones en Python, datos, bases de datos y APIs.'
      ]
    },
    navbar: {
      brand: 'DataMaq',
      brandAriaLabel: 'DataMaq, inicio',
      links: [
        { label: 'Solución', href: '#servicios' },
        { label: 'Proceso', href: '#proceso' },
        { label: 'Alcance', href: '#tarifas' },
        { label: 'Cobertura', href: '#cobertura' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contacto', href: '#contacto' }
      ],
      contactLabel: 'Escribime'
    },
    footer: {
      note: 'DataMaq | Garín (GBA Norte)'
    },
    legal: {
      text: 'La información publicada es referencial y puede actualizarse según alcance, tablero, conectividad y condiciones de implementación.'
    },
    contact: {
      title: 'Contacto',
      subtitle:
        'Contanos tu tablero, objetivo o necesidad de capacitación. Te respondemos con el siguiente paso para automatización, integración o ciencia de datos.',
      labels: {
        email: 'Email',
        message: 'Mensaje'
      },
      submitLabel: 'Enviá',
      checkingMessage: 'Verificando disponibilidad del backend...',
      unavailableMessage: 'Servicio temporalmente no disponible.',
      successMessage: 'Mensaje enviado. Gracias por escribirnos.',
      errorMessage: 'No se pudo enviar. Intentá nuevamente.',
      unexpectedErrorMessage: 'Ocurrió un error inesperado.'
    },
    consent: {
      title: 'Privacidad',
      description: 'Usamos analítica básica para mejorar la experiencia y el seguimiento de consultas.',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Rechazar'
    },
    decisionFlow: {
      processTitle: 'Cómo trabajamos',
      processStepPrefixLabel: 'Paso',
      pricingTitle: 'Alcance del servicio',
      pricingSummaryFallback:
        'El alcance depende del tablero o caso de datos, cantidad de mediciones, stack disponible y objetivo técnico o de capacitación.',
      pricingIncludesTitle: 'Incluye',
      pricingIncludes: [
        'Relevamiento inicial y checklist técnico.',
        'Instalación y configuración básica de Powermeter o Automate según propuesta.',
        'Integración inicial a Powermate o sistema tercero si el alcance lo contempla.',
        'Capacitación o transferencia técnica inicial según el alcance definido.'
      ],
      pricingExcludesTitle: 'No incluye',
      pricingExcludes: [
        'Equipos, sensores o accesorios si no fueron cotizados en la propuesta.',
        'Adecuaciones eléctricas mayores del tablero.',
        'Desarrollo de lógica avanzada, pipelines extensos o integración no prevista en el alcance inicial.'
      ],
      pricingVariablesTitle: 'Puede variar por',
      pricingVariables: [
        'Cantidad de circuitos, señales o puntos a relevar.',
        'Conectividad disponible y necesidad de integración con terceros.',
        'Nivel del equipo, fuentes de datos disponibles y criticidad operativa.'
      ],
      coverageTitle: 'Cobertura y tiempos',
      coverageAreasTitle: 'Zona',
      coverageAreas: [
        'Cobertura prioritaria en GBA Norte.',
        'AMBA sujeto a agenda y viabilidad técnica.',
        'Interior con coordinación previa.'
      ],
      responseTimesTitle: 'Tiempo de respuesta',
      responseTimes: [
        'Respuesta comercial en menos de 24 horas.',
        'Agenda de relevamiento según criticidad y disponibilidad.',
        'Intervenciones urgentes con coordinación previa.'
      ],
      whatsappLabel: 'Pedí coordinación por WhatsApp',
      contactFormLabel: 'Andá al formulario de contacto',
      faqTitle: 'Preguntas frecuentes',
      processSteps: [
        {
          order: 1,
          title: 'Relevamiento y objetivo operativo',
          description:
            'Revisamos tablero, conectividad, variables a medir y objetivo de control para definir una implementación razonable.'
        },
        {
          order: 2,
          title: 'Instalación y configuración',
          description:
            'Montamos Powermeter y/o Automate, configuramos comunicación e integración inicial según el alcance acordado.'
        },
        {
          order: 3,
          title: 'Pruebas y validación',
          description:
            'Verificamos lecturas, comunicaciones, lógica básica y condiciones mínimas de funcionamiento antes del cierre.'
        },
        {
          order: 4,
          title: 'Cierre técnico y próximos pasos',
          description:
            'Entregamos observaciones, pendientes y recomendaciones para estabilizar la solución y seguir escalando.'
        }
      ],
      faqItems: [
        {
          question: '¿Qué hace Powermeter?',
          answer:
            'Permite medir variables eléctricas, ver tendencias, detectar desvíos e integrar la información con Powermate o sistemas de terceros.'
        },
        {
          question: '¿También brindás capacitaciones en Python?',
          answer:
            'Sí. Puedo dar asesoramiento y capacitaciones prácticas en Python, NumPy, pandas, Matplotlib, bases de datos y consumo de APIs, adaptadas al nivel y objetivo del equipo.'
        },
        {
          question: '¿Qué hace Automate?',
          answer:
            'Permite ejecutar lógicas de automatización, control e integración sobre señales y equipos según el objetivo operativo definido.'
        },
        {
          question: '¿Podés ayudar con bases de datos y APIs?',
          answer:
            'Sí. Puedo ayudar a consumir APIs, estructurar consultas, ordenar datos y conectar flujos de información para análisis, reportes o automatizaciones.'
        },
        {
          question: '¿Pueden integrarlo con Powermate o SCADA?',
          answer:
            'Sí. El alcance exacto depende del equipo elegido, la conectividad disponible y el sistema al que haya que vincularse.'
        },
        {
          question: '¿Qué necesitás para cotizar rápido?',
          answer:
            'Zona, fotos del tablero, objetivo del proyecto y una breve descripción de qué querés medir, controlar o automatizar.'
        }
      ]
    },
    thanks: {
      badge: 'Formulario enviado',
      topbarTitle: 'Solicitud finalizada',
      title: '¡Gracias!',
      subtitle: 'Recibimos tu consulta. En breve te contactamos.',
      whatsappButtonLabel: 'Escribime por WhatsApp',
      goHomeButtonLabel: 'Volvé al inicio',
      closeButtonAriaLabel: 'Volvé al inicio'
    },
    homePage: {
      headerContactLabel: 'Contacto',
      heroFallbackContactLabel: 'Iniciá el contacto',
      heroMediaLabel: 'Cobertura técnica activa',
      trustTitle: 'Señales de confianza',
      trustLogos: [],
      profileEyebrow: 'Perfil profesional',
      profileName: 'Agustin Bustos',
      profileWhatsappLabel: 'Escribime directo por WhatsApp',
      profileFormLabel: 'Andá al formulario',
      profileSectionLabel: 'Enfoque técnico',
      servicesEyebrow: 'Servicios',
      servicesIntro:
        'Servicios orientados a tablero, monitoreo, integración y formación técnica en análisis de datos con Python.',
      faqEyebrow: 'Ayuda',
      faqTitle: 'Preguntas frecuentes',
      quickLinks: {
        services: 'Explorá la solución',
        profile: 'Mirá el perfil técnico'
      },
      dockLabels: {
        home: 'Inicio',
        services: 'Solución',
        profile: 'Perfil',
        contact: 'Contacto'
      },
      primaryContactForm: {
        title: 'Iniciá tu proyecto o capacitación',
        subtitle: 'Dejanos tus datos y te contactamos en menos de 24 horas.',
        submitLabel: 'Enviá tu solicitud'
      }
    },
    contactPage: {
      eyebrow: 'Contacto',
      homeButtonLabel: 'Inicio',
      supportTitle: 'Canales disponibles',
      supportItems: [
        'Formulario principal para consultas técnicas y comerciales.',
        'WhatsApp directo para coordinación rápida cuando esté habilitado.'
      ],
      supportBackHomeLabel: 'Volvé al inicio',
      introLinks: {
        services: 'Solución',
        profile: 'Perfil técnico',
        faq: 'FAQ'
      },
      primaryFormSubmitLabel: 'Enviá tu solicitud'
    }
  },
  brand: {
    brandId: 'datamaq',
    brandName: 'DataMaq',
    brandAriaLabel: 'DataMaq, inicio',
    baseOperativa: 'Garín (GBA Norte)',
    contactEmail: 'info@datamaq.com.ar',
    contactFormActive: true,
    whatsappUrl: 'https://wa.me/5491156297160',
    whatsappQr: {
      phoneE164: '5491156297160',
      message:
        'Hola, te contacto por DataMaq. Quiero coordinar una implementación o una capacitación en Python y ciencia de datos.',
      sourceTag: 'qr_card'
    },
    technician: {
      name: 'Agustin Bustos',
      role: 'Técnico a cargo',
      photo: {
        src: '/media/tecnico-a-cargo.webp',
        alt: 'Foto del técnico a cargo',
        width: 100,
        height: 100
      },
      whatsappLabel: 'Coordiná por WhatsApp',
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
      'Automatización industrial, monitoreo energético y servicios de ciencia de datos con asesoramiento y capacitaciones en Python, pandas, APIs y bases de datos.',
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
