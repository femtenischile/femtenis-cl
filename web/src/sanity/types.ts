export type SanityImage = {
  asset?: {_ref: string}
  alt?: string
  credito?: string
  pie?: string
  hotspot?: unknown
  crop?: unknown
}

export type Formato = 'noticia' | 'entrevista' | 'cronica' | 'perfil' | 'memoria' | 'guia'

export type ArticuloTarjeta = {
  _id: string
  titulo: string
  slug: string
  bajada: string
  seccion: 'actualidad' | 'las-tenistas'
  formato: Formato
  destacado?: boolean
  publicadoEn: string
  imagenPrincipal?: SanityImage
  jugadoras: {nombre: string; apellido: string; slug: string}[] | null
  torneo: {nombre: string; slug: string} | null
  palabras?: number
}

export type Bloque = {_type: string; _key: string; [k: string]: unknown}

export type Articulo = ArticuloTarjeta & {
  cuerpo?: Bloque[]
  autoras: {nombre: string; slug: string; rol?: string; bio?: string}[] | null
  seoTitulo?: string
  seoDescripcion?: string
}

export type JugadoraRef = {nombre: string; apellido: string; nacionalidad?: string; slug?: string} | null

export type Partido = {
  _id: string
  ronda: string
  inicio?: string
  horaPorConfirmar?: boolean
  estado: string
  rankingA?: number
  rankingB?: number
  a: JugadoraRef
  b: JugadoraRef
  torneo: {nombre: string; slug: string; sede: string; ciudad: string; superficie: string; categoria: string} | null
}

export type Torneo = {
  _id: string
  nombre: string
  slug: string
  categoria: string
  sede: string
  ciudad: string
  pais?: string
  superficie: string
  fechaInicio: string
  fechaFin?: string
  webOficial?: string
  inscritas: {nombre: string; apellido: string; cuadro?: string}[] | null
}

export type FilaRanking = {
  puesto: number
  puntos?: number
  semana: string
  jugadoraId: string
  nombre: string
  apellido: string
  slug?: string
  foto?: SanityImage
  anterior?: number | null
}

export type Sitio = {
  nombre?: string
  descripcion?: string
  correoContacto?: string
  instagram?: string
  copyright?: string
}

export type Pagina = {
  titulo: string
  slug: string
  antetitulo?: string
  bajada?: string
  plantilla: 'institucional' | 'legal'
  actualizadoEn?: string
  secciones?: Bloque[]
}
