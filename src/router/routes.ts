import type { RouteRecordRaw } from 'vue-router'
import routeMetadata from '@/seo/routes.json'

const metadataByName = new Map(routeMetadata.map((route) => [route.name, route]))

const homeMeta = metadataByName.get('home')
const thanksMeta = metadataByName.get('thanks')
const medicionEscobarMeta = metadataByName.get('medicion-consumo-escobar')
const quoteMeta = metadataByName.get('cotizador')

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
    path: quoteMeta?.path ?? '/cotizador',
    name: 'cotizador',
    component: () => import('@/ui/pages/QuotePage.vue'),
    meta: {
      indexable: quoteMeta?.indexable ?? true,
      name: quoteMeta?.name
    }
  }
]
