import type {Metadata} from 'next'
import {MatchCard} from '@/components/Matches'
import {RankingBox} from '@/components/Ranking'
import {TournamentItem} from '@/components/Tournaments'
import {fechaLarga} from '@/lib/fechas'
import {getPartidosSemana, getRanking, getTorneosProximos} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'El circuito',
  description: 'Ranking WTA de las chilenas, partidos de la semana y calendario de torneos.',
}

export default async function Circuito() {
  const [ranking, semana, torneos] = await Promise.all([getRanking(), getPartidosSemana(), getTorneosProximos()])
  return (
    <>
      <header className="container" style={{paddingTop: 72, paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 20}}>
        <h1 className="display-lg">El circuito</h1>
        <p className="lead">Sigue a las chilenas en el circuito: su ranking, los próximos cruces y los torneos que vienen.</p>
        <nav className="chip-nav" aria-label="En esta página">
          <ul>
            <li><a href="#ranking">Ranking WTA chilenas</a></li>
            <li><a href="#en-cancha">{semana.titulo}</a></li>
            <li><a href="#calendario">Calendario y torneos</a></li>
          </ul>
        </nav>
      </header>

      <section id="ranking" aria-labelledby="h-ranking" style={{paddingBottom: 80}}>
        <div className="container stack" style={{gap: 24}}>
          <div className="section-head">
            <h2 id="h-ranking" className="display-md section-title">Ranking WTA chilenas</h2>
            {ranking[0] ? (
              <p className="small muted">
                Singles · semana del <time dateTime={ranking[0].semana}>{fechaLarga(ranking[0].semana)}</time>
              </p>
            ) : null}
          </div>
          <RankingBox filas={ranking} />
        </div>
      </section>

      <section id="en-cancha" className="section section--alt" aria-labelledby="h-cancha">
        <div className="container stack">
          <div className="section-head">
            <h2 id="h-cancha" className="display-md section-title">{semana.titulo}</h2>
            <p className="small muted">Rondas, superficies y horarios · Hora de Chile</p>
          </div>
          {semana.partidos.length ? (
            <ul className="plain grid-2">
              {semana.partidos.map((p) => (
                <li key={p._id}>
                  <MatchCard p={p} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No hay partidos programados por ahora.</p>
          )}
        </div>
      </section>

      <section id="calendario" className="section" aria-labelledby="h-calendario">
        <div className="container stack">
          <h2 id="h-calendario" className="display-md section-title">Calendario y torneos</h2>
          {torneos.length ? (
            <ol className="plain grid-2">
              {torneos.map((t) => (
                <li key={t._id}>
                  <TournamentItem t={t} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty">No hay torneos próximos cargados.</p>
          )}
        </div>
      </section>
    </>
  )
}
