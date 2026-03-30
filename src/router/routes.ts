import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/ui/pages/HomePage.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/ui/pages/ContactPage.vue')
  },
  {
    path: '/gracias',
    name: 'thanks',
    component: () => import('@/ui/views/ThanksView.vue')
  },
  {
    path: '/medicion-consumo-electrico-escobar',
    name: 'medicion-consumo-escobar',
    component: () => import('@/ui/pages/MedicionConsumoEscobar.vue')
  },
  {
    path: '/cotizador',
    redirect: '/contact'
  },
  {
    path: '/cotizador/:quoteId/web',
    redirect: '/contact'
  }
]
