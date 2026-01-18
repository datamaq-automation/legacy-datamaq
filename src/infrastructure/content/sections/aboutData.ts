import type { AboutContent } from '@/domain/types/content'
import teamTraining from '@/assets/team-training.svg'

export const aboutData: AboutContent = {
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
}
