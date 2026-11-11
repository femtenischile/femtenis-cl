import {fechaLarga} from '@/lib/fechas'
import type {FilaRanking} from '@/sanity/types'

function Variacion({f}: {f: FilaRanking}) {
  if (f.anterior == null) return <span className="delta delta--eq">Sin dato previo</span>
  const d = f.anterior - f.puesto
  if (d > 0) return <span className="delta delta--up">▲ {d}<span className="sr-only"> puestos</span></span>
  if (d < 0) return <span className="delta delta--down">▼ {-d}<span className="sr-only"> puestos</span></span>
  return <span className="delta delta--eq">Sin cambio</span>
}

/** RankingLeader + RankingTable */
export function RankingBox({filas}: {filas: FilaRanking[]}) {
  if (!filas.length) return <p className="empty">Aún no hay ranking cargado.</p>
  const [lider, ...resto] = filas
  const iniciales = `${lider.nombre[0] ?? ''}${lider.apellido[0] ?? ''}`
  return (
    <div className="ranking-box">
      <article className="leader" aria-labelledby="lider">
        <div className="leader__who">
          <div className="avatar" aria-hidden="true">
            {iniciales}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start'}}>
            <p className="badge badge--lime">N.º 1 de Chile</p>
            <h3 id="lider" className="display-sm" style={{fontSize: 36}}>
              {lider.nombre} {lider.apellido}
            </h3>
            <p className="small on-dark-muted">Chile · Singles</p>
          </div>
        </div>
        <dl style={{display: 'flex', gap: 40, flexWrap: 'wrap'}}>
          <div className="stat">
            <dt className="overline on-dark-muted">Puesto WTA</dt>
            <dd className="stat__value stat__value--accent">{lider.puesto}</dd>
          </div>
          {lider.puntos != null ? (
            <div className="stat">
              <dt className="overline on-dark-muted">Puntos</dt>
              <dd className="stat__value">{lider.puntos}</dd>
            </div>
          ) : null}
        </dl>
      </article>
      {resto.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <caption>Resto de las chilenas en el ranking WTA de singles, semana del {fechaLarga(lider.semana)}.</caption>
            <thead>
              <tr>
                <th scope="col">PUESTO</th>
                <th scope="col">TENISTA</th>
                <th scope="col">PUNTOS</th>
                <th scope="col">VARIACIÓN SEMANAL</th>
              </tr>
            </thead>
            <tbody>
              {resto.map((f) => (
                <tr key={f.jugadoraId}>
                  <td className="pos">#{f.puesto}</td>
                  <th scope="row" style={{fontWeight: 600}}>
                    {f.nombre} {f.apellido}
                  </th>
                  <td className="on-dark-muted">{f.puntos ?? '—'}</td>
                  <td>
                    <Variacion f={f} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
