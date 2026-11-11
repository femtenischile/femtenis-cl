import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Breadcrumbs} from './Breadcrumbs'
import {NewsCard} from './Cards'
import {Cuerpo} from './Cuerpo'
import {Img} from './Img'
import {fechaLarga} from '@/lib/fechas'
import {FORMATO_LABEL, nombreCompleto, tiempoLectura} from '@/lib/textos'
import {getArticulo, getArticulosDe, getRelacionadas} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'

type Seccion = 'actualidad' | 'las-tenistas'
const NOMBRE: Record<Seccion, string> = {actualidad: 'Actualidad', 'las-tenistas': 'Las tenistas'}

export async function paramsDe(seccion: Seccion) {
  const lista = await getArticulosDe(seccion)
  // export estático: una ruta vacía rompe el build, así que siempre hay al menos un parámetro
  return lista.length ? lista.map((a) => ({slug: a.slug})) : [{slug: 'sin-articulos'}]
}

export async function metadataArticulo(seccion: Seccion, params: Promise<{slug: string}>): Promise<Metadata> {
  const a = await getArticulo(seccion, (await params).slug)
  if (!a) return {}
  const img = urlFor(a.imagenPrincipal, 1200, 630)
  return {
    title: a.seoTitulo || a.titulo,
    description: a.seoDescripcion || a.bajada,
    alternates: {canonical: `/${seccion}/${a.slug}/`},
    openGraph: {type: 'article', publishedTime: a.publicadoEn, images: img ? [{url: img, width: 1200, height: 630}] : undefined},
  }
}

export async function ArticuloPagina({seccion, slug}: {seccion: Seccion; slug: string}) {
  const a = await getArticulo(seccion, slug)
  if (!a) notFound()
  const relacionadas = await getRelacionadas(a)
  const autoras = (a.autoras ?? []).filter(Boolean)
  const jugadoras = (a.jugadoras ?? []).filter((j) => j?.slug)

  return (
    <>
      <div className="narrow" style={{paddingTop: 32}}>
        <Breadcrumbs items={[{href: '/', label: 'Inicio'}, {href: `/${seccion}/`, label: NOMBRE[seccion]}, {label: a.titulo}]} />
      </div>

      <article aria-labelledby="titulo">
        <header className="narrow article-header">
          <p>
            <span className="badge">{FORMATO_LABEL[a.formato]}</span>
          </p>
          <h1 id="titulo" className="heading-lg" style={{fontSize: 'clamp(32px, 4vw, 48px)'}}>
            {a.titulo}
          </h1>
          <p className="lead" style={{fontSize: 20}}>
            {a.bajada}
          </p>
          <p className="byline">
            {autoras.length ? (
              <span>
                Por{' '}
                {autoras.map((au, i) => (
                  <span key={au.slug}>
                    {i > 0 ? ' y ' : ''}
                    <Link href={`/autoras/${au.slug}/`}>{au.nombre}</Link>
                  </span>
                ))}
              </span>
            ) : null}
            <time dateTime={a.publicadoEn}>{fechaLarga(a.publicadoEn)}</time>
            <span>{tiempoLectura(a.palabras)} min de lectura</span>
          </p>
        </header>

        {a.imagenPrincipal?.asset ? (
          <figure className="container article-figure" style={{maxWidth: 1000}}>
            <div style={{aspectRatio: '16 / 9', borderRadius: 20, overflow: 'hidden'}}>
              <Img image={a.imagenPrincipal} width={1600} height={900} label="imagen principal" priority sizes="(min-width: 1000px) 1000px, 100vw" />
            </div>
            {a.imagenPrincipal.pie || a.imagenPrincipal.credito ? (
              <figcaption>
                {a.imagenPrincipal.pie}
                {a.imagenPrincipal.pie && a.imagenPrincipal.credito ? '. ' : ''}
                {a.imagenPrincipal.credito}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="narrow prose">
          <Cuerpo value={a.cuerpo} />
        </div>

        {jugadoras.length || a.torneo ? (
          <footer className="narrow">
            <div className="related-tags">
              <p className="overline muted" style={{marginRight: 8}}>
                En esta nota
              </p>
              <ul className="plain" style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                {jugadoras.map((j) => (
                  <li key={j.slug}>
                    <Link className="pill" href={`/actualidad/?jugadora=${j.slug}`}>
                      {nombreCompleto(j)}
                      <span className="sr-only">: más notas</span>
                    </Link>
                  </li>
                ))}
                {a.torneo ? (
                  <li>
                    <Link className="pill" href={`/el-circuito/torneos/${a.torneo.slug}/`}>
                      {a.torneo.nombre}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </footer>
        ) : null}
      </article>

      {relacionadas.length ? (
        <section className="section section--alt" aria-labelledby="h-relacionadas">
          <div className="container stack">
            <h2 id="h-relacionadas" className="display-md section-title">
              Notas relacionadas
            </h2>
            <ul className="plain grid-3">
              {relacionadas.map((r) => (
                <li key={r._id}>
                  <NewsCard a={r} excerpt={false} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  )
}
