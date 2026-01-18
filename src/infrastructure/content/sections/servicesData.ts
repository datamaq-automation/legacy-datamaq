import type { ServicesContent } from '@/domain/types/content'
import installTools from '@/assets/install-tools.svg'
import powermeter from '@/assets/powermeter.svg'
import analyticsDashboard from '@/assets/analytics-dashboard.svg'

export const servicesData: ServicesContent = {
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
}
