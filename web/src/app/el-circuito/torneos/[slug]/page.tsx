import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Breadcrumbs} from '@/components/Breadcrumbs'
import {NewsCard} from '@/components/Cards'
import {horaPartido} from '@/components/Matches'
import {dia, fechaLarga, hoyISO, mesCorto} from '@/lib/fechas'
import {PAIS_LABEL, RONDA_LABEL, nombreCompleto} from '@/lib/textos'
import {aTarjeta, getArticulos, getPartidosDeTorneo, getTorneos} from '@/sanity/queries'

export const dynamicParams = false

export async function generateStaticParams() {
  const t = await getTorneos()
  return t.length ? t.map((x) => ({slug: x.slug})) : [{slug: 'sin-torneos'}]
}

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const t = (await getTorneos()).find((x) => x.slug === slug)
  return t ? {title: t.nombre, description: `${t.categoria} · ${t.sede}, ${t.ciudad} · ${t.superficie}`} : {}
}

const ORDEN = ['Q1', 'Q2', 'Q3', 'R128', 'R64', 'R32', 'R16', 'QF', 'SF', 'F']

export default async function TorneoPage({params}: Props) {
  const {slug} = await params
  const t = (await getTorneos()).find((x) => x.slug === slug)
  if (!t) notFound()
  const [partidos, articulos] = await Promise.all([getPartidosDeTorneo(slug), getArticulos()])
  const notas = articulos.filter((a) => a.torneo?.slug === slug).map(aTarjeta)
  const hoy = hoyISO()
  const estado = (t.fechaFin ?? t.fechaInicio) < hoy ? 'Finalizado' : t.fechaInicio > hoy ? 'Próximo' : 'En curso'
  const rondas = ORDEN.map((r) => ({r, ps: partidos.filter((p) => p.ronda === r)})).filter((x) => x.ps.length)

  return (
    <>
      <header className="container" style={{paddingTop: 32, paddingBottom: 48, display: 'flex', flexDirection: 'column', gap: 24}}>
        <Breadcrumbs items={[{href: '/', label: 'Inicio'}, {href: '/el-circuito/', label: 'El circuito'}, {label: t.nombre}]} />
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-end'}}>
          <time className="date-block" dateTime={t.fechaInicio} style={{width: 96, padding: '14px 0'}}>
            <span className="date-block__m" style={{fontSize: 12}}>{mesCorto(t.fechaInicio)}</span>
            <span className="date-block__d" style={{fontSize: 52}}>{dia(t.fechaInicio)}</span>
          </time>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start'}}>
            <p className="badge badge--lime">{estado} · {t.categoria}</p>
            <h1 className="display-xl">{t.nombre}</h1>
          </div>
        </div>
        <dl className="facts" style={{background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 24}}>
          <div>
            <dt>Fechas</dt>
            <dd>
              <time dateTime={t.fechaInicio}>{fechaLarga(t.fechaInicio)}</time>
              {t.fechaFin ? <> al <time dateTime={t.fechaFin}>{fechaLarga(t.fechaFin)}</time></> : null}
            </dd>
          </div>
          <div><dt>Sede</dt><dd>{t.sede}</dd></div>
          <div><dt>Ciudad</dt><dd>{t.ciudad}{t.pais ? `, ${PAIS_LABEL[t.pais] ?? t.pais}` : ''}</dd></div>
          <div><dt>Superficie</dt><dd>{t.superficie}</dd></div>
          <div><dt>Categoría</dt><dd>{t.categoria}</dd></div>
          {t.webOficial ? <div><dt>Web oficial</dt><dd><a href={t.webOficial}>Sitio del torneo</a></dd></div> : null}
        </dl>
      </header>

      <section className="section section--alt" aria-labelledby="h-inscritas">
        <div className="container stack">
          <h2 id="h-inscritas" className="display-md section-title">Chilenas inscritas</h2>
          {t.inscritas?.length ? (
            <ul className="plain grid-4">
              {t.inscritas.map((j) => (
                <li key={nombreCompleto(j)}>
                  <article className="player" style={{flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16}}>
                    <div className="player__body" style={{padding: 0}}>
                      <h3 className="display-sm" style={{fontSize: 20}}>{nombreCompleto(j)}</h3>
                      <p className="small on-dark-muted">{j.cuadro === 'clasificacion' ? 'Clasificación' : 'Cuadro principal'}</p>
                    </div>
                    <div className="avatar" aria-hidden="true" style={{width: 56, height: 56, fontSize: 20, order: -1}}>
                      {j.nombre?.[0]}{j.apellido?.[0]}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">Aún no hay inscritas confirmadas.</p>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="h-partidos">
        <div className="container stack">
          <div className="section-head">
            <h2 id="h-partidos" className="display-md section-title">Partidos</h2>
            <p className="small muted">Hora de Chile</p>
          </div>
          {rondas.length ? (
            rondas.map(({r, ps}) => (
              <section key={r} aria-labelledby={`ronda-${r}`} className="stack" style={{gap: 12}}>
                <h3 id={`ronda-${r}`} className="heading-md">{RONDA_LABEL[r] ?? r}</h3>
                <ul className="plain" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  {ps.map((p) => (
                    <li key={p._id} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '16px 20px', background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 12}}>
                      <p style={{fontWeight: 600}}>
                        {nombreCompleto(p.a)} <span className="muted" style={{fontWeight: 400}}>vs.</span> {p.b ? nombreCompleto(p.b) : 'Rival por confirmar'}
                      </p>
                      <p className="small muted" style={{textTransform: 'capitalize'}}>{p.estado}</p>
                      {p.inicio ? (
                        <time dateTime={p.inicio} style={{fontFamily: 'var(--font-display)', fontSize: 18}}>{horaPartido(p)}</time>
                      ) : (
                        <p style={{fontFamily: 'var(--font-display)', fontSize: 18}}>Por confirmar</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p className="empty">El cuadro aún no está publicado.</p>
          )}
        </div>
      </section>

      {notas.length ? (
        <section className="section section--alt" aria-labelledby="h-notas">
          <div className="container stack">
            <h2 id="h-notas" className="display-md section-title">Notas del torneo</h2>
            <ul className="plain grid-3">
              {notas.map((a) => (
                <li key={a._id}>
                  <NewsCard a={a} excerpt={false} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  )
}
