import type { RouteRecordRaw } from 'vue-router'
import HomePage from '@/ui/pages/HomePage.vue'
import MedicionConsumoEscobar from '@/ui/pages/MedicionConsumoEscobar.vue'
import ThanksView from '@/ui/views/ThanksView.vue'
import routeMetadata from '@/seo/routes.json'

const metadataByName = new Map(routeMetadata.map((route) => [route.name, route]))

const homeMeta = metadataByName.get('home')
const thanksMeta = metadataByName.get('thanks')
const medicionEscobarMeta = metadataByName.get('medicion-consumo-escobar')

export const routes: RouteRecordRaw[] = [
  {
    path: homeMeta?.path ?? '/',
    name: 'home',
    component: HomePage,
    meta: {
      indexable: homeMeta?.indexable ?? true,
      name: homeMeta?.name
    }
  },
  {
    path: thanksMeta?.path ?? '/gracias',
    name: 'thanks',
    component: ThanksView,
    meta: {
      indexable: thanksMeta?.indexable ?? false,
      name: thanksMeta?.name
    }
  },
  {
    path: medicionEscobarMeta?.path ?? '/medicion-consumo-electrico-escobar',
    name: 'medicion-consumo-escobar',
    component: MedicionConsumoEscobar,
    meta: {
      indexable: medicionEscobarMeta?.indexable ?? true,
      name: medicionEscobarMeta?.name
    }
  }
]
