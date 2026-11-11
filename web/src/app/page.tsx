import Link from 'next/link'
import {Arrow} from '@/components/Arrow'
import {Carrusel} from '@/components/Carrusel'
import {NewsCard} from '@/components/Cards'
import {Img} from '@/components/Img'
import {StackedTournaments} from '@/components/Tournaments'
import {fechaCorta} from '@/lib/fechas'
import {FORMATO_LABEL, nombreCompleto, rutaArticulo} from '@/lib/textos'
import {aTarjeta, getArticulos, getPartidosProximos, getPortada, getRanking, getTorneosProximos} from '@/sanity/queries'

export default async function Inicio() {
  const [portada, articulos, ranking, torneos, partidos] = await Promise.all([
    getPortada(),
    getArticulos(),
    getRanking(),
    getTorneosProximos(),
    getPartidosProximos(),
  ])
  const destacado = articulos.find((a) => a._id === portada.destacado) ?? articulos[0]
  const noticias = articulos.filter((a) => a.seccion === 'actualidad' && a._id !== destacado?._id).slice(0, 3).map(aTarjeta)
  const porId = new Map(ranking.map((r) => [r.jugadoraId, r]))
  const carrusel = portada.carrusel?.length
    ? portada.carrusel.map((j) => ({...j, fila: porId.get(j._id)}))
    : ranking.slice(0, 8).map((r) => ({_id: r.jugadoraId, nombre: r.nombre, apellido: r.apellido, slug: r.slug, foto: r.foto, fila: r}))
  const partido = portada.partido ?? partidos[0] ?? null

  return (
    <>
      <h1 className="sr-only">femtenis.cl: tenis femenino chileno</h1>

      {destacado ? (
        <article className="theme-dark section" aria-labelledby="destacado">
          <div className="container split">
            <div className="feature__text">
              <p>
                <span className="badge badge--lime">{FORMATO_LABEL[destacado.formato]}</span>
              </p>
              <h2 id="destacado" className="display-xl">
                <Link href={rutaArticulo(destacado)} style={{color: 'inherit', textDecoration: 'none'}}>
                  {destacado.titulo}
                </Link>
              </h2>
              <p className="lead on-dark-muted">{destacado.bajada}</p>
              <div className="feature__actions">
                <Link className="btn btn--accent btn--lg" href={rutaArticulo(destacado)}>
                  Leer más<span className="sr-only"> sobre {destacado.titulo}</span> <Arrow />
                </Link>
                <time className="label on-dark-muted" dateTime={destacado.publicadoEn}>
                  {fechaCorta(destacado.publicadoEn)}
                </time>
              </div>
            </div>
            <figure className="feature__media">
              <Img image={destacado.imagenPrincipal} width={960} height={600} label="imagen principal" priority sizes="(min-width: 1024px) 580px, 100vw" />
            </figure>
          </div>
        </article>
      ) : null}

      <section className="section" aria-labelledby="h-actualidad">
        <div className="container stack">
          <div className="section-head">
            <h2 id="h-actualidad" className="display-md section-title">
              Actualidad
            </h2>
            <Link className="link-arrow" href="/actualidad/">
              Ver todas las noticias <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="plain grid-3">
            {noticias.map((a) => (
              <li key={a._id}>
                <NewsCard a={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {carrusel.length ? (
        <section className="theme-dark section" aria-labelledby="h-wta">
          <div className="container stack">
            <Carrusel
              id="carrusel-wta"
              etiqueta="Jugadoras"
              titulo={
                <h2 id="h-wta" className="display-md section-title">
                  Chilenas en el circuito WTA
                </h2>
              }
            >
              {carrusel.map((j) => (
                <li key={j._id}>
                  <article className="player">
                    <div className="player__body">
                      <h3 className="display-sm">
                        {j.slug ? (
                          <Link href={`/actualidad/?jugadora=${j.slug}`}>
                            {nombreCompleto(j)}
                            <span className="sr-only">: ver sus notas</span>
                          </Link>
                        ) : (
                          nombreCompleto(j)
                        )}
                      </h3>
                      {j.fila ? (
                        <p className="small on-dark-muted">
                          Puesto WTA {j.fila.puesto}
                          {j.fila.puntos != null ? ` · ${j.fila.puntos} puntos` : ''}
                        </p>
                      ) : null}
                    </div>
                    <div className="player__media" aria-hidden="true">
                      {j.fila ? <span className="player__rank">{j.fila.puesto}</span> : null}
                      <Img image={j.foto} width={320} height={392} label="foto" decorative className="ph-player" />
                    </div>
                  </article>
                </li>
              ))}
            </Carrusel>
          </div>
        </section>
      ) : null}

      <section className="stack-section" aria-labelledby="h-torneos">
        <div className="container">
          <div className="stack-intro">
            <p className="overline" style={{color: 'var(--lime-400)'}}>
              Temporada {new Date().getFullYear()}
            </p>
            <h2 id="h-torneos" className="display-lg section-title" style={{['--accent' as string]: 'var(--lime-400)'}}>
              Próximos torneos
            </h2>
            <p className="lead on-dark-muted" style={{maxWidth: '36ch'}}>
              Baja para recorrer los cruces y torneos que vienen. Cada fecha se apila sobre la anterior.
            </p>
            <Link className="btn btn--accent btn--lg" href="/el-circuito/#calendario">
              Calendario completo <Arrow />
            </Link>
          </div>
          <StackedTournaments partido={partido} torneos={torneos} />
        </div>
      </section>
    </>
  )
}
