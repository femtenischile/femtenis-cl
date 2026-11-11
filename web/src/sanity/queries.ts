import {fetchData} from './fetch'
import type {Articulo, ArticuloTarjeta, FilaRanking, Pagina, Partido, Sitio, Torneo, SanityImage} from './types'
import {hoyISO, sumarDias} from '@/lib/fechas'

// Las consultas se hacen una vez por build y se reutilizan entre páginas.
const memo = new Map<string, Promise<unknown>>()
function once<T>(key: string, fn: () => Promise<T>): Promise<T> {
  // En desarrollo no se guarda en memoria: cada recarga trae el contenido actual
  if (process.env.NODE_ENV === 'development') return fn()
  if (!memo.has(key)) memo.set(key, fn())
  return memo.get(key) as Promise<T>
}

const PARTIDO = `_id, ronda, inicio, horaPorConfirmar, estado, rankingA, rankingB,
  "a": jugadoraA->{nombre, apellido, nacionalidad, "slug": slug.current},
  "b": jugadoraB->{nombre, apellido, nacionalidad, "slug": slug.current},
  "torneo": torneo->{nombre, "slug": slug.current, sede, ciudad, superficie, categoria}`

const TORNEO = `_id, nombre, "slug": slug.current, categoria, sede, ciudad, pais, superficie, fechaInicio, fechaFin, webOficial,
  "inscritas": *[_type == "participacion" && torneo._ref == ^._id]{"nombre": jugadora->nombre, "apellido": jugadora->apellido, cuadro}`

/** Cuenta palabras del cuerpo para calcular el tiempo de lectura. */
function contarPalabras(cuerpo: unknown): number {
  if (!Array.isArray(cuerpo)) return 0
  let n = 0
  for (const b of cuerpo as {_type: string; children?: {text?: string}[]; texto?: string}[]) {
    const texto = b._type === 'block' ? (b.children ?? []).map((c) => c.text ?? '').join(' ') : b.texto ?? ''
    n += texto.split(/\s+/).filter(Boolean).length
  }
  return n
}


export function getArticulos(): Promise<Articulo[]> {
  return once('articulos', async () => {
    const rows = await fetchData<(Articulo & {cuerpo?: unknown})[]>(
      `*[_type == "articulo" && defined(slug.current) && defined(publicadoEn)] | order(publicadoEn desc){
        _id, titulo, "slug": slug.current, bajada, seccion, formato, destacado, publicadoEn, imagenPrincipal,
        cuerpo, seoTitulo, seoDescripcion,
        "jugadoras": jugadoras[]->{nombre, apellido, "slug": slug.current},
        "torneo": torneo->{nombre, "slug": slug.current},
        "autoras": autoras[]->{nombre, "slug": slug.current, rol, bio}
      }`,
    )
    return rows.map((a) => ({...a, palabras: contarPalabras(a.cuerpo)}))
  })
}

/** Tarjetas sin el cuerpo, para listados (se envían al navegador). */
export const aTarjeta = ({cuerpo: _c, autoras: _a, seoTitulo: _t, seoDescripcion: _d, ...t}: Articulo): ArticuloTarjeta => t

export async function getArticulosDe(seccion: 'actualidad' | 'las-tenistas'): Promise<ArticuloTarjeta[]> {
  return (await getArticulos()).filter((a) => a.seccion === seccion).map(aTarjeta)
}

export async function getArticulo(seccion: string, slug: string): Promise<Articulo | undefined> {
  return (await getArticulos()).find((a) => a.seccion === seccion && a.slug === slug)
}

/** Relacionadas: misma jugadora o mismo torneo; si no hay, las más recientes. */
export async function getRelacionadas(a: Articulo, n = 3): Promise<ArticuloTarjeta[]> {
  const todas = (await getArticulos()).filter((x) => x._id !== a._id)
  const jug = new Set((a.jugadoras ?? []).map((j) => j?.slug))
  const rel = todas.filter(
    (x) => (x.jugadoras ?? []).some((j) => jug.has(j?.slug)) || (a.torneo && x.torneo?.slug === a.torneo.slug),
  )
  return [...rel, ...todas.filter((x) => !rel.includes(x))].slice(0, n).map(aTarjeta)
}

export function getSitio(): Promise<Sitio> {
  return once('sitio', async () => (await fetchData<Sitio | null>(`*[_type == "sitio"][0]`)) ?? {})
}

type PortadaRaw = {
  destacado: string | null
  perfilDelMes: string | null
  carrusel: {_id: string; nombre: string; apellido: string; slug?: string; foto?: SanityImage}[] | null
  partido: Partido | null
}

export function getPortada(): Promise<PortadaRaw> {
  return once('portada', async () => {
    const p = await fetchData<PortadaRaw | null>(
      `*[_type == "portada"][0]{
        "destacado": articuloDestacado->_id,
        "perfilDelMes": perfilDelMes->_id,
        "carrusel": jugadorasCarrusel[]->{_id, nombre, apellido, "slug": slug.current, foto},
        "partido": partidoDestacado->{${PARTIDO}}
      }`,
    )
    return p ?? {destacado: null, perfilDelMes: null, carrusel: null, partido: null}
  })
}

/** Ranking de singles de la semana más reciente, con el puesto de la semana anterior. */
export function getRanking(): Promise<FilaRanking[]> {
  return once('ranking', () =>
    fetchData<FilaRanking[]>(
      `*[_type == "rankingSemanal" && modalidad == "singles" &&
         semana == *[_type == "rankingSemanal" && modalidad == "singles"] | order(semana desc)[0].semana]
        | order(puesto asc){
          puesto, puntos, semana,
          "jugadoraId": jugadora._ref,
          "nombre": jugadora->nombre, "apellido": jugadora->apellido, "slug": jugadora->slug.current, "foto": jugadora->foto,
          "anterior": *[_type == "rankingSemanal" && modalidad == "singles" && jugadora._ref == ^.jugadora._ref && semana < ^.semana]
            | order(semana desc)[0].puesto
        }`,
    ),
  )
}

/** Torneos que no han terminado, ordenados por fecha, con sus inscritas. */
export function getTorneosProximos(): Promise<Torneo[]> {
  return once('torneosProximos', () =>
    fetchData<Torneo[]>(
      `*[_type == "torneo" && coalesce(fechaFin, fechaInicio) >= $hoy] | order(fechaInicio asc){${TORNEO}}`,
      {hoy: hoyISO()},
    ),
  )
}

export function getTorneos(): Promise<Torneo[]> {
  return once('torneos', () => fetchData<Torneo[]>(`*[_type == "torneo" && defined(slug.current)] | order(fechaInicio asc){${TORNEO}}`))
}

/** Partidos sin terminar desde hoy en adelante. */
export function getPartidosProximos(): Promise<Partido[]> {
  return once('partidosProximos', () =>
    fetchData<Partido[]>(
      `*[_type == "partido" && !(estado in ["finalizado", "retiro", "w.o."]) && inicio >= $desde] | order(inicio asc){${PARTIDO}}`,
      {desde: `${hoyISO()}T00:00:00Z`},
    ),
  )
}

export async function getPartidosSemana(): Promise<{titulo: string; partidos: Partido[]}> {
  const todos = await getPartidosProximos()
  const limite = `${sumarDias(hoyISO(), 7)}T23:59:59Z`
  const semana = todos.filter((p) => p.inicio && p.inicio <= limite)
  return semana.length
    ? {titulo: 'En cancha esta semana', partidos: semana}
    : {titulo: 'Próximos partidos', partidos: todos.slice(0, 4)}
}

export function getPartidosDeTorneo(slug: string): Promise<Partido[]> {
  return fetchData<Partido[]>(`*[_type == "partido" && torneo->slug.current == $slug] | order(inicio asc){${PARTIDO}}`, {slug})
}

export function getAutoras(): Promise<{nombre: string; slug: string; rol?: string; bio?: string; instagram?: string}[]> {
  return once('autoras', () => fetchData(`*[_type == "autora" && defined(slug.current)]{nombre, "slug": slug.current, rol, bio, instagram}`))
}

export function getPaginas(): Promise<Pagina[]> {
  return once('paginas', () =>
    fetchData<Pagina[]>(`*[_type == "pagina" && defined(slug.current)]{titulo, "slug": slug.current, antetitulo, bajada, plantilla, actualizadoEn, secciones}`),
  )
}

/** Jugadoras seguidas que aparecen en al menos un artículo (para el filtro "Por jugadora"). */
export async function getJugadorasConNotas(): Promise<{nombre: string; apellido: string; slug: string}[]> {
  const vistos = new Map<string, {nombre: string; apellido: string; slug: string}>()
  for (const a of await getArticulos()) for (const j of a.jugadoras ?? []) if (j?.slug) vistos.set(j.slug, j)
  return [...vistos.values()].sort((x, y) => x.apellido.localeCompare(y.apellido, 'es'))
}
