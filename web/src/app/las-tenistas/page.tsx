import type {Metadata} from 'next'
import Link from 'next/link'
import {Suspense} from 'react'
import {Arrow} from '@/components/Arrow'
import {Img} from '@/components/Img'
import {FiltroHistorias, FiltroHistoriasEstatico, GrillaHistorias, ListaHistorias} from '@/components/Listados'
import {rutaArticulo, tiempoLectura} from '@/lib/textos'
import {getArticulosDe, getPortada, getRanking} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Las tenistas',
  description: 'Las historias detrás del marcador. Perfiles, conversaciones y memoria del tenis femenino chileno.',
}

export default async function LasTenistas() {
  const [historias, portada, ranking] = await Promise.all([getArticulosDe('las-tenistas'), getPortada(), getRanking()])
  const perfil = historias.find((h) => h._id === portada.perfilDelMes) ?? historias.find((h) => h.formato === 'perfil')
  const resto = historias.filter((h) => h._id !== perfil?._id)
  const jugadoraPerfil = perfil?.jugadoras?.[0]
  const puesto = jugadoraPerfil ? ranking.find((r) => r.slug === jugadoraPerfil.slug)?.puesto : undefined

  return (
    <>
      <header className="container" style={{paddingTop: 72, display: 'flex', flexDirection: 'column', gap: 20}}>
        <h1 className="display-lg">Las tenistas</h1>
        <p className="lead">Las historias detrás del marcador. Perfiles, conversaciones y memoria del tenis femenino chileno.</p>
        <Suspense fallback={<FiltroHistoriasEstatico />}>
          <FiltroHistorias />
        </Suspense>
      </header>

      {perfil ? (
        <div className="container" style={{paddingTop: 48}}>
          <article className="theme-dark" aria-labelledby="perfil-mes" style={{borderRadius: 28, overflow: 'hidden', display: 'flex', flexWrap: 'wrap'}}>
            <div style={{flex: '1 1 420px', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, alignItems: 'flex-start'}}>
              <p className="badge badge--lime">Perfil del mes</p>
              <h2 id="perfil-mes" className="display-lg" style={{fontSize: 'clamp(36px, 4vw, 56px)'}}>
                <Link href={rutaArticulo(perfil)} style={{color: 'inherit', textDecoration: 'none'}}>
                  {perfil.titulo}
                </Link>
              </h2>
              <p className="lead on-dark-muted">{perfil.bajada}</p>
              <div className="feature__actions">
                <Link className="btn btn--accent btn--lg" href={rutaArticulo(perfil)}>
                  Leer crónica<span className="sr-only">: {perfil.titulo}</span> <Arrow />
                </Link>
                <p className="label on-dark-muted">{tiempoLectura(perfil.palabras)} min de lectura</p>
              </div>
            </div>
            <div
              aria-hidden="true"
              style={{flex: '1 1 420px', minHeight: 360, order: -1, position: 'relative', background: 'var(--purple-800)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}
            >
              {puesto ? (
                <span style={{position: 'absolute', top: 24, left: 28, fontFamily: 'var(--font-display)', fontSize: 120, lineHeight: 0.9, color: 'var(--lime-400)', zIndex: 1}}>
                  {puesto}
                </span>
              ) : null}
              <Img image={perfil.imagenPrincipal} width={840} height={720} label="imagen principal" decorative className="ph--dark" />
            </div>
          </article>
        </div>
      ) : null}

      <section id="historias" className="section" aria-labelledby="h-historias">
        <div className="container stack">
          <Suspense fallback={<GrillaHistorias historias={resto} />}>
            <ListaHistorias historias={resto} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
