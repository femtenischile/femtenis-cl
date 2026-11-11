import type {Formato} from '@/sanity/types'

export const FORMATO_LABEL: Record<Formato, string> = {
  noticia: 'Noticia',
  entrevista: 'Entrevista',
  cronica: 'Crónica',
  perfil: 'Perfil',
  memoria: 'Memoria',
  guia: 'Guía',
}

export const RONDA_LABEL: Record<string, string> = {
  Q1: 'Clasificación · Q1',
  Q2: 'Clasificación · Q2',
  Q3: 'Clasificación · Q3',
  R128: 'Ronda de 128',
  R64: 'Ronda de 64',
  R32: 'Primera ronda',
  R16: 'Octavos de final',
  QF: 'Cuartos de final',
  SF: 'Semifinal',
  F: 'Final',
}

export const PAIS_LABEL: Record<string, string> = {
  CHI: 'Chile', ARG: 'Argentina', BRA: 'Brasil', COL: 'Colombia', PER: 'Perú', URU: 'Uruguay',
  PAR: 'Paraguay', LTU: 'Lituania', USA: 'Estados Unidos', ESP: 'España',
}

export const nombreCompleto = (j?: {nombre?: string; apellido?: string} | null) =>
  j ? `${j.nombre ?? ''} ${j.apellido ?? ''}`.trim() : ''

export const rutaArticulo = (a: {seccion: string; slug: string}) => `/${a.seccion}/${a.slug}/`

export const tiempoLectura = (palabras = 0) => Math.max(1, Math.round(palabras / 200))
