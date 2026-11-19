import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {Img} from './Img'
import {InstagramPost} from './InstagramPost'
import type {Bloque, SanityImage} from '@/sanity/types'

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2>{children}</h2>,
    h3: ({children}) => <h3>{children}</h3>,
    normal: ({children}) => <p>{children}</p>,
  },
  marks: {
    link: ({value, children}) => {
      // Enlaces a otros sitios o a correo se abren en otra pestaña; los internos, en la misma
      const externo = /^(https?:|mailto:)/.test(value?.href ?? '') && !/^https?:\/\/(www\.)?femtenis\.cl/.test(value?.href ?? '')
      return (
        <a href={value?.href} {...(externo ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
          {children}
        </a>
      )
    },
  },
  types: {
    imagenConCredito: ({value}: {value: SanityImage}) => (
      <figure className="article-figure">
        <Img image={value} width={1080} label="imagen" sizes="(min-width: 768px) 720px, 100vw" />
        {value.pie || value.credito ? (
          <figcaption>
            {value.pie}
            {value.pie && value.credito ? '. ' : ''}
            {value.credito}
          </figcaption>
        ) : null}
      </figure>
    ),
    galeria: ({value}: {value: {imagenes?: SanityImage[]; pie?: string}}) => {
      const fotos = (value.imagenes ?? []).filter((i) => i?.asset)
      if (!fotos.length) return null
      const creditos = [...new Set(fotos.map((f) => f.credito).filter(Boolean))].join(', ')
      return (
        <figure className="article-figure galeria">
          <ul className={`plain galeria__grid${fotos.length % 2 ? ' galeria__grid--impar' : ''}`}>
            {fotos.map((f, i) => (
              <li key={i}>
                <Img image={f} width={720} height={540} label="foto" sizes="(min-width: 768px) 360px, 100vw" />
              </li>
            ))}
          </ul>
          {value.pie || creditos ? (
            <figcaption>
              {value.pie}
              {value.pie && creditos ? '. ' : ''}
              {creditos}
            </figcaption>
          ) : null}
        </figure>
      )
    },
    instagram: ({value}: {value: {url?: string}}) => (value.url ? <InstagramPost url={value.url} /> : null),
    cita: ({value}: {value: {texto: string; autora?: string}}) => (
      <blockquote>
        <p>{value.texto}</p>
        {value.autora ? <footer>— {value.autora}</footer> : null}
      </blockquote>
    ),
  },
}

/** Cuerpo de artículos y páginas (Portable Text de Sanity). Los subtítulos empiezan en h2. */
export function Cuerpo({value}: {value?: Bloque[]}) {
  if (!value?.length) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PortableText value={value as any} components={components} />
}
