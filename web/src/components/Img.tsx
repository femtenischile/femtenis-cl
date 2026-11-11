import {urlFor} from '@/sanity/image'
import type {SanityImage} from '@/sanity/types'

type Props = {
  image?: SanityImage | null
  width: number
  height?: number
  label: string
  className?: string
  decorative?: boolean
  priority?: boolean
  sizes?: string
}

/** Imagen servida por el CDN de Sanity con srcset. Sin imagen muestra el placeholder del Design System. */
export function Img({image, width, height, label, className = '', decorative, priority, sizes = '100vw'}: Props) {
  const src = urlFor(image, width, height)
  if (!src) {
    return (
      <div className={`ph ${className}`} aria-hidden="true">
        [{label}]
      </div>
    )
  }
  const ratio = height ? height / width : undefined
  const srcSet = [0.5, 1, 1.5]
    .map((f) => {
      const w = Math.round(width * f)
      return `${urlFor(image, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`
    })
    .join(', ')
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={decorative ? '' : image?.alt ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      className={`img-cover ${className}`}
    />
  )
}
