import imageUrlBuilder from '@sanity/image-url'
import {dataset, projectId} from './env'
import type {SanityImage} from './types'

const builder = projectId ? imageUrlBuilder({projectId, dataset}) : null

/** URL de una imagen de Sanity a un ancho dado (el CDN de Sanity hace el recorte y el formato). */
export function urlFor(image: SanityImage | null | undefined, width: number, height?: number): string | null {
  if (!builder || !image?.asset?._ref) return null
  let b = builder.image(image).width(width).auto('format').fit('crop')
  if (height) b = b.height(height)
  return b.url()
}
