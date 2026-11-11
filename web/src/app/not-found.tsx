import Link from 'next/link'
import {NewsCard} from '@/components/Cards'
import {aTarjeta, getArticulos} from '@/sanity/queries'

export default async function NotFound() {
  const recientes = (await getArticulos()).slice(0, 3).map(aTarjeta)
  return (
    <>
      <div className="theme-dark" style={{padding: '96px 0'}}>
        <div className="container" style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 40}}>
          <div style={{flex: '2 1 480px', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start'}}>
            <p className="overline" style={{color: 'var(--lime-400)'}}>Error 404 · Pelota fuera</p>
            <h1 className="display-xl">No encontramos esta página</h1>
            <p className="lead on-dark-muted">Puede que el enlace esté roto o que la nota haya cambiado de dirección. Vuelve al inicio o revisa lo último que publicamos.</p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
              <Link className="btn btn--accent btn--lg" href="/">Ir al inicio</Link>
              <Link className="btn btn--ghost-dark btn--lg" href="/actualidad/">Ver actualidad</Link>
            </div>
          </div>
          <p aria-hidden="true" style={{flex: '1 1 280px', fontFamily: 'var(--font-display)', fontSize: 'clamp(120px, 16vw, 220px)', lineHeight: 0.9, color: 'var(--lime-400)', textAlign: 'center'}}>
            404
          </p>
        </div>
      </div>
      {recientes.length ? (
        <section className="section" aria-labelledby="h-recientes">
          <div className="container stack">
            <h2 id="h-recientes" className="display-md section-title">Últimas noticias</h2>
            <ul className="plain grid-3">
              {recientes.map((a) => (
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
