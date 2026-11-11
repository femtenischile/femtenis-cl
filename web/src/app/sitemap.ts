import type {MetadataRoute} from 'next'
import {getArticulos, getAutoras, getPaginas, getTorneos} from '@/sanity/queries'
import {rutaArticulo} from '@/lib/textos'

export const dynamic = 'force-static'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://femtenis.cl').replace(/\/$/, '')

/** Mapa del sitio para buscadores: se genera en cada build con todo lo publicado en Sanity. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articulos, torneos, autoras, paginas] = await Promise.all([getArticulos(), getTorneos(), getAutoras(), getPaginas()])
  const url = (ruta: string) => `${SITE_URL}${ruta}`
  return [
    {url: url('/'), changeFrequency: 'daily', priority: 1},
    {url: url('/actualidad/'), changeFrequency: 'daily', priority: 0.9},
    {url: url('/las-tenistas/'), changeFrequency: 'weekly', priority: 0.8},
    {url: url('/el-circuito/'), changeFrequency: 'weekly', priority: 0.8},
    ...articulos.map((a) => ({url: url(rutaArticulo(a)), lastModified: a.publicadoEn, priority: 0.7})),
    ...torneos.map((t) => ({url: url(`/el-circuito/torneos/${t.slug}/`), priority: 0.6})),
    ...paginas.map((p) => ({url: url(`/${p.slug}/`), priority: 0.5})),
    ...autoras.map((a) => ({url: url(`/autoras/${a.slug}/`), priority: 0.3})),
  ]
}
