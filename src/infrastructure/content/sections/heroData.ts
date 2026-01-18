import type { HeroContent } from '@/domain/types/content'
import heroIllustration from '@/assets/hero-energy.svg'

export const heroData: HeroContent = {
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
}
