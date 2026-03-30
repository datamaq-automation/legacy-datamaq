import type { RouteRecordRaw } from 'vue-router'
import routeMetadata from '@/seo/routes.json'

const metadataByName = new Map(routeMetadata.map((route) => [route.name, route]))

const homeMeta = metadataByName.get('home')
const thanksMeta = metadataByName.get('thanks')
const contactMeta = metadataByName.get('contact')
const medicionEscobarMeta = metadataByName.get('medicion-consumo-escobar')

export const routes: RouteRecordRaw[] = [
  {
    path: homeMeta?.path ?? '/',
    name: 'home',
    component: () => import('@/ui/pages/HomePage.vue'),
    meta: {
      indexable: homeMeta?.indexable ?? true,
      name: homeMeta?.name
    }
  },
  {
    path: contactMeta?.path ?? '/contact',
    name: 'contact',
    component: () => import('@/ui/pages/ContactPage.vue'),
    meta: {
      indexable: contactMeta?.indexable ?? true,
      name: contactMeta?.name
    }
  },
  {
    path: thanksMeta?.path ?? '/gracias',
    name: 'thanks',
    component: () => import('@/ui/views/ThanksView.vue'),
    meta: {
      indexable: thanksMeta?.indexable ?? false,
      name: thanksMeta?.name
    }
  },
  {
    path: medicionEscobarMeta?.path ?? '/medicion-consumo-electrico-escobar',
    name: 'medicion-consumo-escobar',
    component: () => import('@/ui/pages/MedicionConsumoEscobar.vue'),
    meta: {
      indexable: medicionEscobarMeta?.indexable ?? true,
      name: medicionEscobarMeta?.name
    }
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
