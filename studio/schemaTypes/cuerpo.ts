import {defineArrayMember, defineField, defineType} from 'sanity'

// Cuerpo de artículos: los subtítulos parten en h2 porque el título del artículo es el h1
export const cuerpo = defineType({
  name: 'cuerpo',
  title: 'Cuerpo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Párrafo', value: 'normal'},
        {title: 'Subtítulo (h2)', value: 'h2'},
        {title: 'Subtítulo secundario (h3)', value: 'h3'},
      ],
      lists: [
        {title: 'Viñetas', value: 'bullet'},
        {title: 'Numerada', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Negrita', value: 'strong'},
          {title: 'Cursiva', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Enlace',
            type: 'object',
            fields: [defineField({name: 'href', title: 'URL', type: 'url', validation: (r) => r.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']})})],
          }),
        ],
      },
    }),
    defineArrayMember({type: 'imagenConCredito', title: 'Foto'}),
    defineArrayMember({
      name: 'galeria',
      title: 'Galería de fotos',
      type: 'object',
      fields: [
        defineField({
          name: 'imagenes',
          title: 'Fotos',
          description: 'Entre 2 y 6 fotos. En computador se muestran de a dos por fila.',
          type: 'array',
          of: [defineArrayMember({type: 'imagenConCredito'})],
          options: {layout: 'grid'},
          validation: (r) => r.required().min(2).max(6),
        }),
        defineField({name: 'pie', title: 'Pie de la galería (opcional)', type: 'string'}),
      ],
      preview: {
        select: {imagenes: 'imagenes', pie: 'pie', media: 'imagenes.0'},
        prepare: ({imagenes, pie, media}) => ({
          title: `Galería · ${imagenes?.length ?? 0} fotos`,
          subtitle: pie,
          media,
        }),
      },
    }),
    defineArrayMember({
      name: 'instagram',
      title: 'Post de Instagram',
      type: 'object',
      fields: [
        defineField({
          name: 'url',
          title: 'Enlace del post',
          description: 'En Instagram: ⋯ del post → Copiar enlace. Sirve para posts y reels públicos.',
          type: 'url',
          validation: (r) =>
            r.required().custom((url?: string) =>
              !url || /^https:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+/.test(url)
                ? true
                : 'Pega el enlace de un post o reel, por ejemplo https://www.instagram.com/p/ABC123/',
            ),
        }),
      ],
      preview: {
        select: {url: 'url'},
        prepare: ({url}) => ({title: 'Post de Instagram', subtitle: url}),
      },
    }),
    defineArrayMember({
      name: 'cita',
      title: 'Cita destacada',
      type: 'object',
      fields: [
        defineField({name: 'texto', title: 'Cita', type: 'text', rows: 3, validation: (r) => r.required()}),
        defineField({name: 'autora', title: 'Quién lo dice', type: 'string'}),
      ],
      preview: {select: {title: 'texto', subtitle: 'autora'}},
    }),
  ],
})
