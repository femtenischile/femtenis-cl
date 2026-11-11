import {defineField, defineType} from 'sanity'

export const FORMATOS = [
  {title: 'Noticia', value: 'noticia'},
  {title: 'Entrevista', value: 'entrevista'},
  {title: 'Crónica', value: 'cronica'},
  {title: 'Perfil', value: 'perfil'},
  {title: 'Memoria', value: 'memoria'},
  {title: 'Guía', value: 'guia'},
]

export const articulo = defineType({
  name: 'articulo',
  title: 'Artículo',
  type: 'document',
  groups: [
    {name: 'contenido', title: 'Contenido', default: true},
    {name: 'relaciones', title: 'Relaciones'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'titulo', title: 'Título', type: 'string', group: 'contenido', validation: (r) => r.required().max(90)}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'contenido', options: {source: 'titulo'}, validation: (r) => r.required()}),
    defineField({
      name: 'bajada',
      title: 'Bajada',
      type: 'text',
      rows: 3,
      group: 'contenido',
      description: 'Se usa en las tarjetas y como descripción para buscadores.',
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: 'seccion',
      title: 'Sección',
      type: 'string',
      group: 'contenido',
      options: {list: [{title: 'Actualidad', value: 'actualidad'}, {title: 'Las tenistas', value: 'las-tenistas'}], layout: 'radio'},
      initialValue: 'actualidad',
      validation: (r) => r.required(),
    }),
    defineField({name: 'formato', title: 'Formato', type: 'string', group: 'contenido', options: {list: FORMATOS}, validation: (r) => r.required()}),
    defineField({
      name: 'destacado',
      title: 'Destacado en Actualidad',
      type: 'boolean',
      group: 'contenido',
      description: 'El destacado más reciente encabeza el listado de Actualidad.',
      initialValue: false,
    }),
    defineField({name: 'publicadoEn', title: 'Fecha de publicación', type: 'datetime', group: 'contenido', initialValue: () => new Date().toISOString(), validation: (r) => r.required()}),
    defineField({name: 'imagenPrincipal', title: 'Imagen principal', type: 'imagenConCredito', group: 'contenido'}),
    defineField({name: 'cuerpo', title: 'Cuerpo', type: 'cuerpo', group: 'contenido'}),
    defineField({name: 'autoras', title: 'Autoras', type: 'array', group: 'relaciones', of: [{type: 'reference', to: [{type: 'autora'}]}]}),
    defineField({
      name: 'jugadoras',
      title: 'Jugadoras mencionadas',
      type: 'array',
      group: 'relaciones',
      description: 'Alimenta el filtro "Por jugadora" y las notas relacionadas.',
      of: [{type: 'reference', to: [{type: 'jugadora'}], options: {filter: 'seguida == true'}}],
    }),
    defineField({
      name: 'torneo',
      title: 'Torneo relacionado',
      type: 'reference',
      group: 'relaciones',
      to: [{type: 'torneo'}],
      description: 'Alimenta el filtro "Torneos" y las notas del torneo.',
    }),
    defineField({name: 'seoTitulo', title: 'Título para buscadores', type: 'string', group: 'seo', description: 'Si queda vacío se usa el título.'}),
    defineField({name: 'seoDescripcion', title: 'Descripción para buscadores', type: 'text', rows: 2, group: 'seo', description: 'Si queda vacía se usa la bajada.'}),
  ],
  orderings: [{title: 'Publicación, más reciente', name: 'publicadoDesc', by: [{field: 'publicadoEn', direction: 'desc'}]}],
  preview: {
    select: {title: 'titulo', seccion: 'seccion', formato: 'formato', media: 'imagenPrincipal'},
    prepare: ({title, seccion, formato, media}) => ({title, subtitle: `${seccion ?? ''} · ${formato ?? ''}`, media}),
  },
})
