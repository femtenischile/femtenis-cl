import Link from 'next/link'
import {Img} from './Img'
import {Heading} from './SectionTitle'
import {fechaCorta} from '@/lib/fechas'
import {FORMATO_LABEL, rutaArticulo, tiempoLectura} from '@/lib/textos'
import type {ArticuloTarjeta} from '@/sanity/types'

/** NewsCard: el título va primero en el DOM; la imagen se reordena arriba con CSS. */
export function NewsCard({a, level = 3, excerpt = true}: {a: ArticuloTarjeta; level?: 2 | 3; excerpt?: boolean}) {
  return (
    <article className="card" style={{height: '100%'}}>
      <div className="card__body">
        <p className="card__meta">
          <span className="badge">{FORMATO_LABEL[a.formato]}</span>
          <time className="label" dateTime={a.publicadoEn}>
            {fechaCorta(a.publicadoEn)}
          </time>
        </p>
        <Heading level={level} className="heading-sm card__title">
          <Link href={rutaArticulo(a)}>{a.titulo}</Link>
        </Heading>
        {excerpt ? <p className="card__excerpt">{a.bajada}</p> : null}
      </div>
      <div className="card__media">
        <Img image={a.imagenPrincipal} width={640} height={360} label="imagen principal" decorative sizes="(min-width: 1024px) 380px, 100vw" />
      </div>
    </article>
  )
}

/** StoryCard: historias largas con tiempo de lectura (sin firma, como en el diseño). */
export function StoryCard({a}: {a: ArticuloTarjeta}) {
  return (
    <article className="card card--story" style={{height: '100%'}}>
      <div className="card__body">
        <p>
          <span className="badge">{FORMATO_LABEL[a.formato]}</span>
        </p>
        <h3 className="heading-md card__title">
          <Link href={rutaArticulo(a)}>{a.titulo}</Link>
        </h3>
        <p className="card__excerpt" style={{fontSize: 15}}>
          {a.bajada}
        </p>
        <p className="card__foot">
          <time dateTime={a.publicadoEn}>{fechaCorta(a.publicadoEn)}</time>
          <span>{tiempoLectura(a.palabras)} min de lectura</span>
        </p>
      </div>
      <div className="card__media">
        <Img image={a.imagenPrincipal} width={720} height={480} label="imagen principal" decorative sizes="(min-width: 1024px) 580px, 100vw" />
      </div>
    </article>
  )
}
