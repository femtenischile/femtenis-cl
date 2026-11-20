import Link from 'next/link'
import {dia, mesCorto, mesLargo, diaSemana} from '@/lib/fechas'
import {nombreCompleto} from '@/lib/textos'
import type {Partido, TarjetaManual, Torneo} from '@/sanity/types'

/** TournamentItem: fecha en bloque + nombre, sede e inscritas. */
export function TournamentItem({t, level = 3}: {t: Torneo; level?: 2 | 3}) {
  const H = `h${level}` as const
  return (
    <article className="tourney" style={{height: '100%'}}>
      <div className="tourney__body">
        <H className="heading-md tourney__title" style={{fontSize: 20}}>
          <Link href={`/el-circuito/torneos/${t.slug}/`}>{t.nombre}</Link>
        </H>
        <p className="small muted">
          {t.sede} · {t.superficie}
        </p>
        {t.inscritas?.length ? (
          <>
            <p className="overline muted" style={{marginTop: 6}}>
              Inscritas
            </p>
            <ul className="tourney__players">
              {t.inscritas.map((j) => (
                <li key={nombreCompleto(j)} className="pill">
                  {nombreCompleto(j)}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
      <time className="date-block" dateTime={t.fechaInicio} style={{order: -1}}>
        <span className="date-block__m">{mesCorto(t.fechaInicio)}</span>
        <span className="date-block__d">{dia(t.fechaInicio)}</span>
      </time>
    </article>
  )
}

const TONOS = ['stack-card--lime', 'stack-card--snow', 'stack-card--violet', 'stack-card--plum', 'stack-card--white']

type Tarjeta = {
  id: string
  torneo: string
  slug: string
  sede: string
  detalle: string
  etiqueta: string
  fecha: string
  mes: string
  izq: {nombre: string; nota: string}
  der: {nombre: string; nota: string}
  vs?: boolean
}

/** StackedTournaments: tarjetas que se apilan al hacer scroll (position: sticky). */
export function StackedTournaments({partido, torneos, manuales}: {partido: Partido | null; torneos: Torneo[]; manuales?: TarjetaManual[] | null}) {
  const cards: Tarjeta[] = []
  // Tarjetas armadas a mano en Portada: si hay, se usan solo esas
  for (const m of manuales ?? []) {
    cards.push({
      id: `m-${m._key}`,
      torneo: m.torneo?.nombre ?? '',
      slug: m.torneo?.slug ?? '',
      sede: [m.torneo?.sede, m.hora ? `${m.hora} h` : null].filter(Boolean).join(' · '),
      detalle: m.detalle || m.torneo?.superficie || '',
      etiqueta: m.etiqueta || m.torneo?.categoria || '',
      fecha: m.fecha,
      mes: m.hora ? `${diaSemana(m.fecha)} · ${mesCorto(m.fecha)}` : mesLargo(m.fecha),
      izq: {nombre: m.izq ?? '', nota: m.notaIzq ?? ''},
      der: {nombre: m.der ?? '', nota: m.notaDer ?? ''},
      vs: m.mostrarVs !== false && Boolean(m.izq && m.der),
    })
  }
  if (!cards.length && partido?.torneo && partido.inicio) {
    cards.push({
      id: `t-${partido._id}`,
      torneo: partido.torneo.nombre,
      slug: partido.torneo.slug,
      sede: `${partido.torneo.sede}${partido.horaPorConfirmar ? ' · hora por confirmar' : ''}`,
      detalle: `${partido.ronda} · ${partido.torneo.superficie}`,
      etiqueta: 'Partido',
      fecha: partido.inicio,
      mes: `${diaSemana(partido.inicio)} · ${mesCorto(partido.inicio)}`,
      izq: {nombre: nombreCompleto(partido.a), nota: [partido.a?.nacionalidad, partido.rankingA && `#${partido.rankingA}`].filter(Boolean).join(' · ')},
      der: partido.b
        ? {nombre: nombreCompleto(partido.b), nota: [partido.b.nacionalidad, partido.rankingB && `#${partido.rankingB}`].filter(Boolean).join(' · ')}
        : {nombre: 'Rival por confirmar', nota: ''},
      vs: true,
    })
  }
  for (const t of manuales?.length ? [] : torneos) {
    if (cards.length >= 5) break
    const ins = t.inscritas ?? []
    const extra = ins.length > 2 ? ` y ${ins.length - 2} más` : ''
    cards.push({
      id: `t-${t._id}`,
      torneo: t.nombre,
      slug: t.slug,
      sede: t.sede,
      detalle: t.superficie,
      etiqueta: t.categoria,
      fecha: t.fechaInicio,
      mes: mesLargo(t.fechaInicio),
      izq: ins[0] ? {nombre: nombreCompleto(ins[0]), nota: 'Inscrita'} : {nombre: 'Por confirmar', nota: 'Inscritas'},
      der: ins[1] ? {nombre: nombreCompleto(ins[1]), nota: `Inscrita${extra}`} : {nombre: '', nota: ''},
    })
  }
  if (!cards.length) return <p className="empty">No hay torneos próximos cargados.</p>
  const total = String(cards.length).padStart(2, '0')
  return (
    <ol className="stack-list" aria-labelledby="h-torneos">
      {cards.map((c, i) => (
        <li key={c.id}>
          <article className={`stack-card ${TONOS[i % TONOS.length]}`} aria-labelledby={c.id}>
            <div className="stack-card__foot">
              <p>{c.sede}</p>
              <h3 id={c.id} className="stack-card__title">
                {c.slug ? <Link href={`/el-circuito/torneos/${c.slug}/`}>{c.torneo}</Link> : c.torneo}
              </h3>
            </div>
            <div className="stack-card__head">
              <p className="overline">
                {String(i + 1).padStart(2, '0')} / {total} · {c.detalle}
              </p>
              <span className="stack-card__badge">{c.etiqueta}</span>
            </div>
            <div className="stack-card__main">
              <p className="stack-card__side">
                <span className="stack-card__name">{c.izq.nombre}</span>
                <span className="stack-card__note">{c.izq.nota}</span>
              </p>
              <div className="stack-card__centro">
                {c.vs ? <span className="stack-card__vs">vs.</span> : null}
                <time className="stack-card__date" dateTime={c.fecha}>
                  <span className="stack-card__month">{c.mes}</span>
                  <span className="stack-card__day">{dia(c.fecha)}</span>
                </time>
              </div>
              <p className="stack-card__side">
                <span className="stack-card__name">{c.der.nombre}</span>
                <span className="stack-card__note">{c.der.nota}</span>
              </p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  )
}
