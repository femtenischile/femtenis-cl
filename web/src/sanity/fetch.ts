import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'
import {evaluate, parse} from 'groq-js'

import {apiVersion, dataset, projectId} from './env'

/** Sin Project ID el sitio usa los datos de ejemplo de seed/demo.ndjson (modo demo). */
export {isDemo} from './env'

const client = projectId
  ? createClient({projectId, dataset, apiVersion, useCdn: true, perspective: 'published'})
  : null

let demoDocs: unknown[] | null = null
function loadDemo() {
  // En desarrollo se relee el archivo en cada visita, así los cambios en seed/demo.ndjson se ven al recargar
  if (!demoDocs || process.env.NODE_ENV === 'development') {
    const file = path.join(process.cwd(), '..', 'seed', 'demo.ndjson')
    demoDocs = fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
  }
  return demoDocs
}

/** Ejecuta una consulta GROQ contra Sanity o, en modo demo, contra los datos locales. */
export async function fetchData<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (client) return client.fetch<T>(query, params)
  const tree = parse(query, {params})
  const value = await evaluate(tree, {dataset: loadDemo(), params})
  return (await value.get()) as T
}
