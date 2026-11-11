import type {Metadata} from 'next'
import Link from 'next/link'
import {Suspense} from 'react'
import {Arrow} from '@/components/Arrow'
import {Img} from '@/components/Img'
import {FiltroActualidad, FiltroActualidadEstatico, GrillaNoticias, ListaActualidad} from '@/components/Listados'
import {fechaCorta} from '@/lib/fechas'
import {rutaArticulo} from '@/lib/textos'
import {getArticulosDe, getJugadorasConNotas} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Actualidad',
  description: 'Noticias, resultados y anuncios del tenis femenino chileno, dentro y fuera del país.',
}

export default async function Actualidad() {
  const [articulos, jugadoras] = await Promise.all([getArticulosDe('actualidad'), getJugadorasConNotas()])
  const destacado = articulos.find((a) => a.destacado) ?? articulos[0]
  const resto = articulos.filter((a) => a._id !== destacado?._id)

  return (
    <>
      <header className="container" style={{paddingTop: 72, display: 'flex', flexDirection: 'column', gap: 20}}>
        <h1 className="display-lg">Actualidad</h1>
        <p className="lead">Noticias, resultados y anuncios del tenis femenino chileno, dentro y fuera del país.</p>
        <Suspense fallback={<FiltroActualidadEstatico />}>
          <FiltroActualidad jugadoras={jugadoras} />
        </Suspense>
      </header>

      {destacado ? (
        <article className="section--tight" aria-labelledby="destacado">
          <div className="container split">
            <div className="feature__text">
              <p className="card__meta">
                <span className="badge badge--lime">Destacado</span>
                <time className="label" dateTime={destacado.publicadoEn}>
                  {fechaCorta(destacado.publicadoEn)}
                </time>
              </p>
              <h2 id="destacado" className="heading-lg">
                <Link href={rutaArticulo(destacado)} style={{color: 'inherit', textDecoration: 'none'}}>
                  {destacado.titulo}
                </Link>
              </h2>
              <p className="lead">{destacado.bajada}</p>
              <Link className="btn btn--primary" href={rutaArticulo(destacado)}>
                Leer más<span className="sr-only"> sobre {destacado.titulo}</span> <Arrow />
              </Link>
            </div>
            <figure className="feature__media">
              <Img image={destacado.imagenPrincipal} width={960} height={600} label="imagen principal" priority sizes="(min-width: 1024px) 580px, 100vw" />
            </figure>
          </div>
        </article>
      ) : null}

      <section id="listado" className="section" aria-labelledby="h-listado">
        <div className="container stack">
          <Suspense fallback={<GrillaNoticias articulos={resto} titulo="Últimas noticias" />}>
            <ListaActualidad articulos={resto} jugadoras={jugadoras} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
