/*
Path: src/infrastructure/content/siteSnapshot.datamaq.ts
*/

import type { SiteSnapshot } from '@/domain/types/site'

export const datamaqSiteSnapshot: SiteSnapshot = {
  content: {
    hero: {
      badge: 'Instalación IoT, análisis de datos y capacitación aplicada',
      title: 'Captura automática de datos operativos para decidir mejor',
      subtitle:
        'Instalación de equipos IoT para medir energía, producción y variables clave. Luego, asesoramiento y capacitaciones para transformar esos datos en decisiones útiles.',
      responseNote:
        'Base operativa: Garín (GBA Norte). Relevamiento inicial y alcance por WhatsApp. Implementación en campo y acompañamiento remoto según el caso.',
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
          title: 'Datos confiables',
          text: 'Captura automática de kWh, potencia, factor de potencia, armónicas, kilos, unidades, metros o velocidades según el caso.',
          variant: 'primary'
        },
        {
          title: 'Integración razonable',
          text: 'Conexión a Powermate, dashboards o sistemas existentes según conectividad y objetivo operativo.',
          variant: 'success'
        },
        {
          title: 'Decisiones con base real',
          text: 'Análisis y acompañamiento para pasar de la intuición a evidencia operativa.',
          variant: 'warning'
        }
      ],
      image: {
        src: '/media/hero-energy.svg',
        alt: 'Captura y monitoreo de datos energéticos y operativos en entorno industrial',
        width: 900,
        height: 700
      }
    },
    services: {
      title: 'Instalación, análisis y capacitación con datos operativos',
      cards: [
        {
          id: 'iot-installation',
          title: 'Instalación de equipos IoT para captura de datos',
          description:
            'Relevamiento, montaje, configuración y puesta en marcha de soluciones para capturar datos de energía, producción y variables críticas.',
          subtitle: 'Del tablero y la máquina al dato útil',
          media: {
            src: '/media/install-tools.svg',
            alt: 'Instalación de equipos IoT y captura de datos en campo',
            width: 900,
            height: 700
          },
          items: [
            'Medición de kWh, potencia, factor de potencia y armónicas',
            'Captura de kilos, unidades, metros, velocidades o estados',
            'Integración inicial con Powermate, dashboards o sistemas de terceros'
          ],
          note:
            'Según el caso, la implementación puede apoyarse en Powermeter, Automate u otros equipos compatibles con el objetivo operativo.',
          cta: {
            label: 'Consultá por instalación',
            href: '#contacto',
            action: 'contact',
            section: 'contacto'
          }
        },
        {
          id: 'data-advisory',
          title: 'Asesoramiento para decisiones basadas en datos',
          description:
            'Acompañamiento técnico para interpretar datos operativos y convertirlos en criterios de seguimiento, diagnóstico y mejora.',
          subtitle: 'Del dato capturado a la decisión',
          media: {
            src: '/media/analytics-dashboard.svg',
            alt: 'Análisis de datos operativos y energéticos',
            width: 900,
            height: 700
          },
          items: [
            'Análisis de consumo energético y comportamiento operativo',
            'Ordenamiento de datos desde bases, planillas, APIs o sistemas existentes',
            'Soporte para reportes, dashboards y automatizaciones de seguimiento'
          ],
          note:
            'El asesoramiento puede incluir Python, bases de datos, APIs e integraciones, según el nivel del equipo y el problema a resolver.',
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
            'Capacitaciones técnicas orientadas a casos reales de trabajo, para que el equipo pueda usar mejor los datos disponibles.',
          subtitle: 'Formación práctica para operación y análisis',
          media: {
            src: '/media/team-training.svg',
            alt: 'Capacitación técnica aplicada en análisis de datos',
            width: 900,
            height: 700
          },
          items: [
            'Python aplicado con NumPy, pandas y Matplotlib',
            'Buenas prácticas para trabajar con bases de datos y APIs',
            'Capacitación adaptada al nivel técnico y al caso real del equipo'
          ],
          note:
            'Puede brindarse en formato remoto o combinado, según objetivos, disponibilidad y perfil del equipo.',
          cta: {
            label: 'Consultá por capacitación',
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
        'DataMaq implementa soluciones para capturar datos operativos en forma automática, con foco en energía eléctrica, producción y variables críticas.',
        'A partir de esa base, brinda asesoramiento para análisis de datos y capacitaciones aplicadas en Python, bases de datos, APIs e integraciones.'
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
      text: 'La información publicada es referencial y puede actualizarse según alcance, tablero, conectividad, variables a capturar y condiciones de implementación.'
    },
    contact: {
      title: 'Contacto',
      subtitle:
        'Contanos qué datos querés capturar, desde dónde y para qué objetivo operativo. Te respondemos con el siguiente paso para instalación, análisis o capacitación.',
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
        'El alcance depende de qué datos haya que capturar, cantidad de mediciones, conectividad disponible, stack existente y objetivo técnico del proyecto.',
      pricingIncludesTitle: 'Incluye',
      pricingIncludes: [
        'Relevamiento inicial y checklist técnico.',
        'Instalación y configuración básica de la solución propuesta según el caso.',
        'Integración inicial a Powermate o sistema tercero si el alcance lo contempla.',
        'Transferencia técnica inicial o capacitación breve según el alcance definido.'
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
        'Fuentes de datos disponibles, criticidad operativa y nivel del equipo.'
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
            'Revisamos tablero, máquinas, conectividad, variables a capturar y objetivo del proyecto para definir una implementación razonable.'
        },
        {
          order: 2,
          title: 'Instalación y configuración',
          description:
            'Montamos la solución, configuramos comunicación e integración inicial según el alcance acordado.'
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
            'Entregamos observaciones, pendientes y recomendaciones para estabilizar la captura de datos y aprovecharla mejor.'
        }
      ],
      faqItems: [
        {
          question: '¿Qué tipo de datos se pueden capturar?',
          answer:
            'Según el caso, se pueden capturar variables eléctricas como kWh, potencia, factor de potencia y armónicas, o variables operativas como kilos, unidades, metros, velocidades y estados.'
        },
        {
          question: '¿Trabajás solo con energía eléctrica?',
          answer:
            'No. La energía es uno de los focos principales, pero también puedo implementar soluciones para capturar datos de producción u otras variables operativas relevantes.'
        },
        {
          question: '¿Usás Powermeter y Automate?',
          answer:
            'Sí. Según el proyecto, la implementación puede apoyarse en Powermeter para medición eléctrica y en Automate para captura e integración de señales y datos operativos.'
        },
        {
          question: '¿También brindás asesoramiento en análisis de datos?',
          answer:
            'Sí. Puedo acompañar el análisis de datos operativos y energéticos, ayudar a ordenar información y proponer formas prácticas de usarla para decidir mejor.'
        },
        {
          question: '¿También brindás capacitaciones?',
          answer:
            'Sí. Doy capacitaciones aplicadas en Python, NumPy, pandas, Matplotlib, bases de datos y APIs, adaptadas al nivel del equipo y al problema real a resolver.'
        },
        {
          question: '¿Qué necesitás para cotizar rápido?',
          answer:
            'Zona, fotos del tablero o proceso, objetivo del proyecto y una breve descripción de qué datos querés capturar o qué problema querés seguir con más claridad.'
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
        'Servicios orientados a la captura automática de datos, su análisis aplicado y la capacitación técnica del equipo.',
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
        'Hola, te contacto por DataMaq. Quiero coordinar una instalación para captura de datos o una consulta sobre análisis y capacitación aplicada.',
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
      'Instalación de equipos IoT para captura automática de datos de energía y producción, más asesoramiento y capacitaciones aplicadas en análisis de datos.',
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
