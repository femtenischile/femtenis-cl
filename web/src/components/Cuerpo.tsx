import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {Img} from './Img'
import type {Bloque, SanityImage} from '@/sanity/types'

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2>{children}</h2>,
    h3: ({children}) => <h3>{children}</h3>,
    normal: ({children}) => <p>{children}</p>,
  },
  marks: {
    link: ({value, children}) => <a href={value?.href}>{children}</a>,
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
