/*
Path: src/infrastructure/content/siteSnapshot.datamaq.ts
*/

import type { SiteSnapshot } from '@/domain/types/site'

export const datamaqSiteSnapshot: SiteSnapshot = {
  content: {
    hero: {
      badge: 'Captura automática de datos operativos',
      title: 'Instalación e integración de equipos IoT para energía y producción',
      subtitle:
        'Implementación de soluciones para medir variables eléctricas y operativas, integrarlas a sistemas existentes y dejar una base técnica usable para seguimiento, diagnóstico y capacitación.',
      responseNote:
        'Base operativa: Garín (GBA Norte). El alcance se define según tablero, señales disponibles, conectividad, sistema destino y objetivo operativo.',
      primaryCta: {
        label: 'Escribime por WhatsApp',
        href: 'https://wa.me/5491156297160',
        action: 'whatsapp'
      },
      secondaryCta: {
        label: 'Ver alcance técnico',
        href: '#servicios',
        action: 'services'
      },
      benefits: [
        {
          title: 'Variables definidas',
          text: 'Captura de kWh, potencia, factor de potencia, armónicas, kilos, unidades, metros, velocidades o estados según el caso.',
          variant: 'primary'
        },
        {
          title: 'Integración según alcance',
          text: 'Vinculación con Powermate, dashboards o sistemas de terceros cuando la conectividad y el objetivo lo permiten.',
          variant: 'success'
        },
        {
          title: 'Base técnica para análisis',
          text: 'Datos ordenados y utilizables para seguimiento operativo, diagnóstico, reportes o formación técnica.',
          variant: 'warning'
        }
      ],
      image: {
        src: '/media/hero-energy.svg',
        alt: 'Captura e integración de datos energéticos y operativos en entorno industrial',
        width: 900,
        height: 700
      }
    },
    services: {
      title: 'Servicios técnicos sobre captura, integración y uso de datos',
      cards: [
        {
          id: 'iot-installation',
          title: 'Instalación de equipos IoT para captura de datos',
          description:
            'Relevamiento, montaje, configuración y puesta en marcha de soluciones para medir variables eléctricas y operativas en tableros, líneas o puntos definidos.',
          subtitle: 'Captura, comunicación e integración inicial',
          media: {
            src: '/media/install-tools.svg',
            alt: 'Instalación de equipos IoT y captura de datos en campo',
            width: 900,
            height: 700
          },
          items: [
            'Medición de kWh, potencia, factor de potencia y distorsión armónica',
            'Captura de kilos, unidades, metros, velocidades o estados',
            'Integración inicial con Powermate o sistemas de terceros'
          ],
          note:
            'Según el caso, la implementación puede apoyarse en Powermeter, Automate u otros equipos compatibles con la variable a capturar y el objetivo del proyecto.',
          cta: {
            label: 'Consultá por instalación',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        },
        {
          id: 'data-advisory',
          title: 'Asesoramiento técnico para análisis de datos',
          description:
            'Acompañamiento para estructurar, interpretar y explotar datos ya capturados, con foco en seguimiento operativo, diagnóstico y criterio de decisión.',
          subtitle: 'Datos, estructura y criterio técnico',
          media: {
            src: '/media/analytics-dashboard.svg',
            alt: 'Análisis técnico de datos operativos y energéticos',
            width: 900,
            height: 700
          },
          items: [
            'Análisis de consumo energético y comportamiento operativo',
            'Ordenamiento de datos desde bases, planillas, APIs o sistemas existentes',
            'Soporte para reportes, dashboards y automatizaciones de seguimiento'
          ],
          note:
            'El asesoramiento puede incluir Python, bases de datos, APIs e integraciones cuando el caso requiere tratamiento, cruce o automatización de información.',
          cta: {
            label: 'Consultá por asesoramiento',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        },
        {
          id: 'training',
          title: 'Capacitaciones aplicadas',
          description:
            'Formación técnica orientada a equipos que necesiten trabajar con datos operativos, Python, bases de datos, APIs o integraciones sobre casos reales.',
          subtitle: 'Capacitación sobre casos concretos',
          media: {
            src: '/media/team-training.svg',
            alt: 'Capacitación técnica aplicada en análisis e integración de datos',
            width: 900,
            height: 700
          },
          items: [
            'Python aplicado con NumPy, pandas y Matplotlib',
            'Buenas prácticas para trabajar con bases de datos y APIs',
            'Capacitación adaptada al nivel técnico y al caso real del equipo'
          ],
          note:
            'No se trata de formación genérica. El enfoque se ajusta al problema, los datos disponibles y el nivel técnico de quienes participan.',
          cta: {
            label: 'Consultá por capacitación',
            href: 'https://cursos.datamaq.com.ar',
            action: 'contact',
            section: 'contacto'
          }
        }
      ]
    },
    about: {
      title: 'Sobre DataMaq',
      paragraphs: [
        'DataMaq trabaja sobre captura automática de datos operativos, con foco en energía eléctrica, producción y variables críticas de seguimiento.',
        'El servicio combina relevamiento en campo, implementación técnica, integración inicial y acompañamiento para que los datos capturados puedan usarse con criterio en análisis, seguimiento o capacitación.'
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
        'Instalación, integración y puesta en marcha para captura automática de datos.',
        'Asesoramiento y capacitaciones sobre Python, datos, bases de datos y APIs en contextos reales.'
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
      text: 'La información publicada es referencial y puede actualizarse según alcance, tablero, señales disponibles, conectividad, sistema destino y condiciones de implementación.'
    },
    contact: {
      title: 'Contacto',
      subtitle:
        'Indicá qué variable querés capturar, desde qué equipo o proceso, con qué objetivo y en qué zona. Si ya contás con fotos del tablero, señales disponibles o sistema destino, mejor.',
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
        'El alcance depende de las variables a capturar, cantidad de mediciones, señales disponibles, conectividad, sistema destino y objetivo técnico del proyecto.',
      pricingIncludesTitle: 'Incluye',
      pricingIncludes: [
        'Relevamiento inicial y checklist técnico.',
        'Instalación y configuración básica de la solución propuesta según el caso.',
        'Integración inicial con Powermate o sistema tercero si el alcance lo contempla.',
        'Transferencia técnica inicial o capacitación breve según el alcance definido.'
      ],
      pricingExcludesTitle: 'No incluye',
      pricingExcludes: [
        'Equipos, sensores o accesorios si no fueron cotizados en la propuesta.',
        'Adecuaciones eléctricas mayores del tablero o de la instalación.',
        'Desarrollo de lógica avanzada, pipelines extensos o integración no prevista en el alcance inicial.'
      ],
      pricingVariablesTitle: 'Puede variar por',
      pricingVariables: [
        'Cantidad de circuitos, señales o puntos a relevar.',
        'Conectividad disponible y necesidad de integración con terceros.',
        'Criticidad operativa, disponibilidad de datos y nivel del equipo involucrado.'
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
          title: 'Relevamiento y definición del caso',
          description:
            'Revisamos tablero, equipo, proceso, conectividad, variables a capturar y objetivo técnico para definir una implementación razonable.'
        },
        {
          order: 2,
          title: 'Instalación y configuración',
          description:
            'Montamos la solución, configuramos comunicación e integración inicial y dejamos el esquema básico de captura funcionando según el alcance acordado.'
        },
        {
          order: 3,
          title: 'Pruebas y validación',
          description:
            'Verificamos lecturas, comunicaciones y condiciones mínimas de funcionamiento antes del cierre técnico.'
        },
        {
          order: 4,
          title: 'Cierre técnico y próximos pasos',
          description:
            'Entregamos observaciones, pendientes y recomendaciones para estabilizar la captura, ordenar los datos y definir el siguiente nivel de uso.'
        }
      ],
      faqItems: [
        {
          question: '¿Qué tipo de datos se pueden capturar?',
          answer:
            'Según el caso, variables eléctricas como kWh, potencia, factor de potencia y distorsión armónica, o variables operativas como kilos, unidades, metros, velocidades y estados.'
        },
        {
          question: '¿Trabajás solo con energía eléctrica?',
          answer:
            'No. La energía es una de las aplicaciones principales, pero también se pueden implementar soluciones para captura de datos de producción u otras variables operativas relevantes.'
        },
        {
          question: '¿Usás Powermeter y Automate?',
          answer:
            'Sí. Según el proyecto, la solución puede apoyarse en Powermeter para medición eléctrica y en Automate para captura e integración de señales y datos operativos.'
        },
        {
          question: '¿También brindás asesoramiento sobre los datos capturados?',
          answer:
            'Sí. El acompañamiento puede incluir estructuración, análisis e interpretación técnica de datos operativos y energéticos, según la necesidad del caso.'
        },
        {
          question: '¿También brindás capacitaciones?',
          answer:
            'Sí. Las capacitaciones están orientadas a equipos que necesiten trabajar con datos reales usando Python, bases de datos, APIs o integraciones, no a formación genérica desvinculada del caso.'
        },
        {
          question: '¿Qué necesitás para evaluar el caso?',
          answer:
            'Como base: zona, fotos del tablero o equipo, variables a capturar, objetivo del proyecto, conectividad disponible y sistema al que haya que integrar, si aplica.'
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
        'Servicios orientados a captura automática de datos, integración técnica y formación aplicada sobre casos reales.',
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
        title: 'Iniciá una consulta técnica',
        subtitle: 'Dejanos el contexto del caso y te respondemos con el siguiente paso.',
        submitLabel: 'Enviá tu consulta'
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
      primaryFormSubmitLabel: 'Enviá tu consulta'
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
        'Hola, te contacto por DataMaq. Quiero coordinar una implementación para captura de datos o una consulta técnica sobre análisis y capacitación aplicada.',
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
      'Instalación e integración de equipos IoT para captura automática de datos de energía y producción, más asesoramiento técnico y capacitaciones aplicadas.',
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
