import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Breadcrumbs} from '@/components/Breadcrumbs'
import {StoryCard} from '@/components/Cards'
import {aTarjeta, getArticulos, getAutoras} from '@/sanity/queries'

export const dynamicParams = false

export async function generateStaticParams() {
  const a = await getAutoras()
  return a.length ? a.map((x) => ({slug: x.slug})) : [{slug: 'sin-autoras'}]
}

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const a = (await getAutoras()).find((x) => x.slug === slug)
  return a ? {title: a.nombre, description: a.bio} : {}
}

export default async function AutoraPage({params}: Props) {
  const {slug} = await params
  const autora = (await getAutoras()).find((x) => x.slug === slug)
  if (!autora) notFound()
  const articulos = (await getArticulos()).filter((a) => (a.autoras ?? []).some((x) => x?.slug === slug)).map(aTarjeta)
  return (
    <>
      <header className="container" style={{paddingTop: 32, paddingBottom: 56, display: 'flex', flexDirection: 'column', gap: 32}}>
        <Breadcrumbs items={[{href: '/', label: 'Inicio'}, {label: 'Autoras'}, {label: autora.nombre}]} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start'}}>
          {autora.rol ? <p className="badge">{autora.rol}</p> : null}
          <h1 className="display-lg">{autora.nombre}</h1>
          {autora.bio ? <p className="lead">{autora.bio}</p> : null}
          {autora.instagram ? (
            <a className="link-arrow" href={autora.instagram}>
              Instagram de {autora.nombre} <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </header>
      <section className="section section--alt" aria-labelledby="h-articulos">
        <div className="container stack">
          <div className="section-head">
            <h2 id="h-articulos" className="display-md section-title">Artículos de {autora.nombre}</h2>
            <p className="small muted">{articulos.length} {articulos.length === 1 ? 'artículo' : 'artículos'}</p>
          </div>
          <ul className="plain grid-2">
            {articulos.map((a) => (
              <li key={a._id}>
                <StoryCard a={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
