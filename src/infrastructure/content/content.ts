/*
Path: src/infrastructure/content/content.ts
*/

import type { AppContent } from '@/domain/types/content'
import analyticsDashboard from '@/assets/analytics-dashboard.svg'
import heroIllustration from '@/assets/hero-energy.svg'
import installTools from '@/assets/install-tools.svg'
import powermeter from '@/assets/powermeter.svg'
import teamTraining from '@/assets/team-training.svg'

export const content: AppContent = {
  hero: {
    badge: 'Consulta Virtual sin cargo',
    title: 'Energía y producción alineadas a tus objetivos de planta',
    subtitle:
      'Instalamos los medidores críticos y te acompañamos para que el OEE y los kWh/unidad guíen cada decisión operativa.',
    responseNote: 'Respuesta en menos de 24 horas con agenda de instalación y análisis de datos.',
    chatUnavailableMessage:
      'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos, gracias por tu paciencia.',
    primaryCta: {
      label: 'Agendar diagnóstico por WhatsApp',
      action: 'whatsapp'
    },
    secondaryCta: {
      label: 'Conocer servicios',
      href: '#servicios'
    },
    benefits: [
      {
        title: 'Línea base en semanas',
        text: 'Lecturas continuas de energía y producción con checklist validado.',
        variant: 'success'
      },
      {
        title: 'Decisiones guiadas por OEE',
        text: 'Disponibilidad, rendimiento y calidad listos para priorizar mejoras.',
        variant: 'primary'
      },
      {
        title: 'Preferencia cooperativas y sector gráfico',
        text: 'Planes ajustados a industrias del GBA Norte sin exclusiones.',
        variant: 'warning'
      }
    ],
    image: {
      src: heroIllustration,
      alt: 'Ilustración de tablero digital con indicadores de energía',
      width: 420,
      height: 320
    }
  },
  services: {
    title: 'Servicios',
    cards: [
      {
        id: 'instalacion',
        title: 'Instalación de medidores',
        description:
          'Diseñamos y dejamos operativa la captura de datos de energía y producción para que empieces a medir sin fricciones.',
        subtitle: 'Entregables',
        media: {
          src: installTools,
          alt: 'Ilustración de herramientas y plano técnico',
          width: 140,
          height: 120
        },
        items: [
          'Mapa priorizado de puntos eléctricos y de proceso.',
          'Checklist de instalación, seguridad y calibración.',
          'Configuración inicial validada con lecturas de referencia.'
        ],
        figure: {
          src: powermeter,
          alt: 'Ilustración de medidor de energía',
          width: 220,
          height: 140,
          caption: 'Equipos powermeter industriales para lecturas confiables desde el primer día.'
        },
        cta: {
          label: 'Agendar diagnóstico por WhatsApp',
          action: 'whatsapp',
          section: 'servicios-instalacion'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      },
      {
        id: 'consultoria',
        title: 'Consultoría en datos y mejora',
        description:
          'Interpretamos la línea base (energía/unidad, disponibilidad y rendimiento) y priorizamos dónde intervenir primero.',
        subtitle: 'Resultados clave',
        media: {
          src: analyticsDashboard,
          alt: 'Ilustración de dashboard con indicadores energéticos',
          width: 160,
          height: 140
        },
        items: [
          'Dashboard base con kWh/unidad, disponibilidad y rendimiento.',
          'Matriz impacto/esfuerzo con quick wins y proyectos estructurales.',
          'Informe ejecutivo con próximos pasos y período de repago estimado.'
        ],
        note:
          'Visualizamos indicadores como IDEn, OEE y payback para alinear a equipos técnicos y gerencia en las mismas prioridades.',
        figure: {
          src: analyticsDashboard,
          alt: 'Ilustración de dashboard con indicadores energéticos',
          width: 160,
          height: 140
        },
        cta: {
          label: 'Agendar diagnóstico por WhatsApp',
          action: 'whatsapp',
          section: 'servicios-consultoria'
        },
        unavailableMessage:
          'El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.'
      }
    ]
  },
  about: {
    title: 'Sobre profebustos',
    paragraphs: [
      'profebustos es liderado por profesionales con experiencia en la industria y la educación técnica. Nuestra misión es ayudar a las empresas del GBA Norte a mejorar su eficiencia energética y operativa, combinando tecnología de medición y formación especializada.',
      'El responsable principal cuenta con trayectoria en instalaciones industriales y docencia, aportando una visión integral para interpretar datos y tomar decisiones informadas.'
    ],
    image: {
      src: teamTraining,
      alt: 'Ilustración de equipo técnico en sesión de formación',
      width: 240,
      height: 180
    }
  },
  navbar: {
    brand: 'profebustos',
    brandAriaLabel: 'profebustos, inicio',
    links: [
      {
        label: 'Servicios',
        href: '#servicios'
      }
    ],
    contactLabel: 'Agendar diagnóstico por WhatsApp'
  },
  footer: {
    note: 'Preferencia: GBA Norte y sector cooperativas'
  },
  legal: {
    text:
      'Contacto únicamente por WhatsApp (y chat cuando esté disponible). Casos de éxito se publican solo con autorización (o en formato anónimo). Las cookies de analítica (GA4 y Clarity) se habilitan únicamente tras tu consentimiento explícito.'
  },
  contact: {
    title: 'Preferís coordinar por correo electrónico',
    subtitle: 'Completá el formulario y recibirás una respuesta a tu correo electrónico',
    labels: {
      name: 'Nombre y apellido',
      email: 'Correo electrónico',
      company: 'Empresa (opcional)',
      message: 'Mensaje (opcional)'
    },
    submitLabel: 'Enviar consulta por correo',
    checkingMessage: 'Verificando la disponibilidad del servicio de correo electrónico…',
    unavailableMessage:
      'El canal de correo electrónico está en mantenimiento. Nuestro canal principal es WhatsApp: agendá tu diagnóstico allí y retomá este formulario más tarde si necesitás documentación.',
    successMessage: '¡Consulta enviada correctamente! Te responderemos a la brevedad.',
    errorMessage: 'No se pudo enviar la consulta. Intenta nuevamente más tarde.',
    unexpectedErrorMessage: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
  },
  consent: {
    title: 'Usamos cookies para analítica',
    description:
      'Aceptá para habilitar Google Analytics 4 y Microsoft Clarity. Podés revisar los detalles en la sección legal del sitio.',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Rechazar'
  },
  whatsappFab: {
    ariaLabel: 'Abrir chat de WhatsApp'
  }
}
