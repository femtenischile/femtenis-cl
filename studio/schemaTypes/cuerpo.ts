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
    defineArrayMember({type: 'imagenConCredito'}),
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
