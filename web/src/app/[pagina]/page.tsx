import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Arrow, InstagramIcon} from '@/components/Arrow'
import {Breadcrumbs} from '@/components/Breadcrumbs'
import {Cuerpo} from '@/components/Cuerpo'
import {fechaLarga} from '@/lib/fechas'
import {getPaginas, getSitio} from '@/sanity/queries'
import type {Bloque} from '@/sanity/types'

export const dynamicParams = false

export async function generateStaticParams() {
  const p = await getPaginas()
  return p.length ? p.map((x) => ({pagina: x.slug})) : [{pagina: 'sobre'}]
}

type Props = {params: Promise<{pagina: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {pagina} = await params
  const p = (await getPaginas()).find((x) => x.slug === pagina)
  return p ? {title: p.antetitulo ?? p.titulo, description: p.bajada} : {}
}

const idDe = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

type Sec = Bloque & {
  titulo?: string
  cuerpo?: Bloque[]
  texto?: string
  items?: {_key: string; titulo: string; texto?: string; enlace?: string}[]
  misionTitular?: string
  misionTexto?: string
  visionTitular?: string
  visionTexto?: string
}

export default async function PaginaPage({params}: Props) {
  const {pagina} = await params
  const [p, sitio] = await Promise.all([getPaginas().then((ps) => ps.find((x) => x.slug === pagina)), getSitio()])
  if (!p) notFound()
  const secciones = (p.secciones ?? []) as Sec[]

  if (p.plantilla === 'legal') {
    const conTitulo = secciones.filter((s) => s.titulo)
    return (
      <div className="container" style={{paddingTop: 32, paddingBottom: 96}}>
        <Breadcrumbs items={[{href: '/', label: 'Inicio'}, {label: p.titulo}]} />
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 48, paddingTop: 48, alignItems: 'flex-start'}}>
          <nav aria-label="En esta página" style={{flex: '1 1 240px', maxWidth: 280, background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 24}}>
            <p className="overline muted" style={{marginBottom: 12}}>En esta página</p>
            <ol style={{display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, fontSize: 14}}>
              {conTitulo.map((s) => (
                <li key={s._key}><a href={`#${idDe(s.titulo!)}`}>{s.titulo}</a></li>
              ))}
            </ol>
          </nav>
          <article aria-labelledby="titulo" style={{flex: '999 1 560px', minWidth: 0, maxWidth: 720}}>
            <header style={{display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 32, borderBottom: '1px solid var(--gray-200)'}}>
              <h1 id="titulo" className="display-lg">{p.titulo}</h1>
              {p.actualizadoEn ? (
                <p className="small muted">Última actualización: <time dateTime={p.actualizadoEn}>{fechaLarga(p.actualizadoEn)}</time></p>
              ) : null}
            </header>
            <div className="prose">
              {conTitulo.map((s) => (
                <section key={s._key} aria-labelledby={idDe(s.titulo!)} style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                  <h2 id={idDe(s.titulo!)}>{s.titulo}</h2>
                  <Cuerpo value={s.cuerpo} />
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="theme-dark" style={{padding: '96px 0'}}>
        <div className="container" style={{display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start'}}>
          {p.antetitulo ? <p className="overline" style={{color: 'var(--lime-400)'}}>{p.antetitulo}</p> : null}
          <h1 className="display-xl" style={{maxWidth: '16ch'}}>{p.titulo}</h1>
          {p.bajada ? <p className="lead on-dark-muted" style={{fontSize: 20}}>{p.bajada}</p> : null}
        </div>
      </header>

      {secciones.map((s) => {
        switch (s._type) {
          case 'seccionTexto':
            return (
              <section key={s._key} className="section" aria-labelledby={idDe(s.titulo ?? s._key)}>
                <div className="container" style={{display: 'flex', flexWrap: 'wrap', gap: '32px 64px'}}>
                  <h2 id={idDe(s.titulo ?? s._key)} className="display-md section-title" style={{flex: '1 1 300px'}}>{s.titulo}</h2>
                  <div className="prose" style={{flex: '2 1 480px', padding: 0, maxWidth: '68ch'}}>
                    <Cuerpo value={s.cuerpo} />
                  </div>
                </div>
              </section>
            )
          case 'seccionPilares':
            return (
              <section key={s._key} className="section" aria-labelledby={idDe(s.titulo ?? s._key)} style={{paddingTop: 0}}>
                <div className="container stack">
                  <h2 id={idDe(s.titulo ?? s._key)} className="display-md section-title">{s.titulo}</h2>
                  <ul className="plain" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24}}>
                    {(s.items ?? []).map((it, i) => (
                      <li key={it._key} className="pillar">
                        <h3 className="display-sm">{it.enlace ? <Link href={it.enlace}>{it.titulo}</Link> : it.titulo}</h3>
                        {it.texto ? <p className="small muted">{it.texto}</p> : null}
                        <span className="pillar__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )
          case 'seccionMisionVision':
            return (
              <div key={s._key} className="section section--alt">
                <div className="container" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24}}>
                  <section className="statement statement--lime" aria-labelledby={`mision-${s._key}`}>
                    <h2 id={`mision-${s._key}`} className="overline">Misión</h2>
                    {s.misionTitular ? <p className="display-md">{s.misionTitular}</p> : null}
                    {s.misionTexto ? <p style={{fontSize: 18, lineHeight: 1.6}}>{s.misionTexto}</p> : null}
                  </section>
                  <section className="statement statement--dark" aria-labelledby={`vision-${s._key}`}>
                    <h2 id={`vision-${s._key}`} className="overline" style={{color: 'var(--lime-400)'}}>Visión</h2>
                    {s.visionTitular ? <p className="display-md">{s.visionTitular}</p> : null}
                    {s.visionTexto ? <p className="on-dark-muted" style={{fontSize: 18, lineHeight: 1.6}}>{s.visionTexto}</p> : null}
                  </section>
                </div>
              </div>
            )
          case 'seccionContacto':
            return (
              <section key={s._key} className="section" aria-labelledby={`contacto-${s._key}`}>
                <div className="container">
                  <div className="cta-band">
                    <div style={{flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 14}}>
                      <h2 id={`contacto-${s._key}`} className="display-md">{s.titulo}</h2>
                      {s.texto ? <p className="on-dark-muted" style={{fontSize: 17, lineHeight: 1.6, maxWidth: '52ch'}}>{s.texto}</p> : null}
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
                      {sitio.correoContacto ? (
                        <a className="btn btn--accent btn--lg" href={`mailto:${sitio.correoContacto}`}>Escríbenos <Arrow /></a>
                      ) : null}
                      {sitio.instagram ? (
                        <a className="btn btn--ghost-dark btn--lg" href={sitio.instagram}><InstagramIcon /> Instagram</a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </section>
            )
          default:
            return null
        }
      })}
    </>
  )
}
