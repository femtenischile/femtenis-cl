'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {useState} from 'react'
import {NewsCard, StoryCard} from './Cards'
import type {ArticuloTarjeta, Formato} from '@/sanity/types'

/* Los filtros son enlaces que cambian la URL (?jugadora=, ?por=, ?formato=): se pueden compartir.
   Como el sitio es estático, el filtrado ocurre en el navegador; el HTML inicial trae el listado completo. */

const POR_PAGINA = 9
type Jug = {nombre: string; apellido: string; slug: string}

export function FiltroItems({items, actual, label}: {items: {key: string; href: string; label: string}[]; actual: string; label: string}) {
  return (
    <nav className="filter-nav" aria-label={label}>
      <ul>
        {items.map((it) => (
          <li key={it.key}>
            <Link href={it.href} scroll={false} aria-current={it.key === actual ? 'page' : undefined}>
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ---------- Actualidad ---------- */

const FILTROS_ACTUALIDAD = [
  {key: 'todas', href: '/actualidad/', label: 'Todas'},
  {key: 'jugadora', href: '/actualidad/?por=jugadora', label: 'Por jugadora'},
  {key: 'torneos', href: '/actualidad/?por=torneos', label: 'Torneos'},
]

function leerFiltroActualidad(sp: URLSearchParams) {
  const jugadora = sp.get('jugadora')
  const por = jugadora ? 'jugadora' : sp.get('por') === 'jugadora' ? 'jugadora' : sp.get('por') === 'torneos' ? 'torneos' : 'todas'
  return {por, jugadora}
}

export function FiltroActualidad({jugadoras}: {jugadoras: Jug[]}) {
  const sp = useSearchParams()
  const {por, jugadora} = leerFiltroActualidad(new URLSearchParams(sp.toString()))
  return (
    <>
      <FiltroItems items={FILTROS_ACTUALIDAD} actual={por} label="Filtrar noticias" />
      {por === 'jugadora' ? (
        <nav aria-label="Elegir jugadora">
          <ul className="plain" style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
            {jugadoras.map((j) => (
              <li key={j.slug}>
                <Link className="pill" scroll={false} href={`/actualidad/?jugadora=${j.slug}`} aria-current={j.slug === jugadora ? 'true' : undefined}>
                  {j.nombre} {j.apellido}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  )
}

export function FiltroActualidadEstatico() {
  return <FiltroItems items={FILTROS_ACTUALIDAD} actual="todas" label="Filtrar noticias" />
}

export function GrillaNoticias({articulos, titulo}: {articulos: ArticuloTarjeta[]; titulo: string}) {
  return (
    <>
      <div className="section-head">
        <h2 id="h-listado" className="display-md section-title">
          {titulo}
        </h2>
        <p className="small muted" aria-live="polite">
          {articulos.length} {articulos.length === 1 ? 'nota' : 'notas'}
        </p>
      </div>
      {articulos.length ? (
        <ul className="plain grid-3">
          {articulos.slice(0, POR_PAGINA).map((a) => (
            <li key={a._id}>
              <NewsCard a={a} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Todavía no hay notas con este filtro.</p>
      )}
    </>
  )
}

export function ListaActualidad({articulos, jugadoras}: {articulos: ArticuloTarjeta[]; jugadoras: Jug[]}) {
  const sp = useSearchParams()
  const {por, jugadora} = leerFiltroActualidad(new URLSearchParams(sp.toString()))
  const [visibles, setVisibles] = useState(POR_PAGINA)
  let lista = articulos
  let titulo = 'Últimas noticias'
  if (por === 'torneos') {
    lista = articulos.filter((a) => a.torneo)
    titulo = 'Notas de torneos'
  } else if (por === 'jugadora') {
    lista = jugadora ? articulos.filter((a) => (a.jugadoras ?? []).some((j) => j?.slug === jugadora)) : articulos.filter((a) => a.jugadoras?.length)
    const j = jugadoras.find((x) => x.slug === jugadora)
    titulo = j ? `Notas sobre ${j.nombre} ${j.apellido}` : 'Notas por jugadora'
  }
  return (
    <>
      <div className="section-head">
        <h2 id="h-listado" className="display-md section-title">
          {titulo}
        </h2>
        <p className="small muted" aria-live="polite">
          {lista.length} {lista.length === 1 ? 'nota' : 'notas'}
        </p>
      </div>
      {lista.length ? (
        <ul className="plain grid-3">
          {lista.slice(0, visibles).map((a) => (
            <li key={a._id}>
              <NewsCard a={a} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Todavía no hay notas con este filtro.</p>
      )}
      {lista.length > visibles ? (
        <button type="button" className="btn btn--secondary load-more" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
          Cargar más noticias
        </button>
      ) : null}
    </>
  )
}

/* ---------- Las tenistas ---------- */

const GRUPOS: Record<string, Formato[]> = {
  entrevista: ['entrevista'],
  articulos: ['cronica', 'perfil', 'guia', 'noticia'],
  memoria: ['memoria'],
}
const FILTROS_HISTORIAS = [
  {key: 'todos', href: '/las-tenistas/', label: 'Todos'},
  {key: 'entrevista', href: '/las-tenistas/?formato=entrevista', label: 'Entrevistas'},
  {key: 'articulos', href: '/las-tenistas/?formato=articulos', label: 'Artículos'},
  {key: 'memoria', href: '/las-tenistas/?formato=memoria', label: 'Memoria'},
]

export function FiltroHistorias() {
  const sp = useSearchParams()
  const f = sp.get('formato') ?? 'todos'
  return <FiltroItems items={FILTROS_HISTORIAS} actual={GRUPOS[f] ? f : 'todos'} label="Filtrar por formato" />
}

export function FiltroHistoriasEstatico() {
  return <FiltroItems items={FILTROS_HISTORIAS} actual="todos" label="Filtrar por formato" />
}

export function GrillaHistorias({historias}: {historias: ArticuloTarjeta[]}) {
  return (
    <>
      <div className="section-head">
        <h2 id="h-historias" className="display-md section-title">
          Historias a fondo
        </h2>
        <p className="small muted" aria-live="polite">
          {historias.length} {historias.length === 1 ? 'historia' : 'historias'}
        </p>
      </div>
      {historias.length ? (
        <ul className="plain grid-2">
          {historias.slice(0, POR_PAGINA).map((a) => (
            <li key={a._id}>
              <StoryCard a={a} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Todavía no hay historias de este formato.</p>
      )}
    </>
  )
}

export function ListaHistorias({historias}: {historias: ArticuloTarjeta[]}) {
  const sp = useSearchParams()
  const f = sp.get('formato') ?? 'todos'
  const [visibles, setVisibles] = useState(POR_PAGINA)
  const lista = GRUPOS[f] ? historias.filter((h) => GRUPOS[f].includes(h.formato)) : historias
  return (
    <>
      <GrillaHistorias historias={lista.slice(0, visibles)} />
      {lista.length > visibles ? (
        <button type="button" className="btn btn--outline load-more" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
          Cargar más historias
        </button>
      ) : null}
    </>
  )
}
