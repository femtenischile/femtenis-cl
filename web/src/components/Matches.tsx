import {diaSemana, hora, fechaCorta} from '@/lib/fechas'
import {PAIS_LABEL, RONDA_LABEL, nombreCompleto} from '@/lib/textos'
import type {Partido} from '@/sanity/types'

export function horaPartido(p: Partido) {
  if (!p.inicio) return 'Por confirmar'
  if (p.horaPorConfirmar) return `${diaSemana(p.inicio)} ${fechaCorta(p.inicio).replace(/ \d{4}$/, '')} · hora por confirmar`
  return `${diaSemana(p.inicio)} · ${hora(p.inicio)} h`
}

function Pais({codigo, ranking}: {codigo?: string; ranking?: number}) {
  if (!codigo) return <p>—</p>
  return (
    <p>
      <abbr title={PAIS_LABEL[codigo] ?? codigo}>{codigo}</abbr>
      {ranking ? ` · #${ranking}` : ''}
    </p>
  )
}

/** MatchCard: tarjeta lima de un partido. */
export function MatchCard({p}: {p: Partido}) {
  const b = p.b ? nombreCompleto(p.b) : 'Rival por confirmar'
  return (
    <article className="match">
      <div className="match__head">
        <p className="overline">{p.torneo?.nombre}</p>
        <span className="badge badge--dark">{p.ronda}</span>
      </div>
      <h3 className="match__title">
        <span className="match__name">{nombreCompleto(p.a)}</span> <span className="match__vs">vs.</span>{' '}
        <span className="match__name">{b}</span>
      </h3>
      <div className="match__title small">
        <Pais codigo={p.a?.nacionalidad} ranking={p.rankingA} />
        <span />
        <Pais codigo={p.b?.nacionalidad} ranking={p.rankingB} />
      </div>
      <div className="match__foot">
        <p>
          {RONDA_LABEL[p.ronda] ?? p.ronda} · {p.torneo?.superficie}
        </p>
        {p.inicio ? (
          <time className="match__time" dateTime={p.inicio}>
            {horaPartido(p)}
          </time>
        ) : (
          <p className="match__time">Por confirmar</p>
        )}
      </div>
    </article>
  )
}
