import {defineArrayMember, defineField, defineType} from 'sanity'

// Páginas institucionales (Sobre) y legales (Privacidad, Términos), armadas por secciones
export const pagina = defineType({
  name: 'pagina',
  title: 'Página',
  type: 'document',
  fields: [
    defineField({name: 'titulo', title: 'Título (h1)', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'titulo'},
      description: 'Define la URL: sobre, privacidad, terminos',
      validation: (r) => r.required(),
    }),
    defineField({name: 'antetitulo', title: 'Antetítulo', type: 'string', description: 'Texto pequeño sobre el h1. Ej.: Sobre FemTenisChile'}),
    defineField({name: 'bajada', title: 'Bajada', type: 'text', rows: 3}),
    defineField({
      name: 'plantilla',
      title: 'Plantilla',
      type: 'string',
      options: {list: [{title: 'Institucional', value: 'institucional'}, {title: 'Legal (con índice)', value: 'legal'}], layout: 'radio'},
      initialValue: 'institucional',
      validation: (r) => r.required(),
    }),
    defineField({name: 'actualizadoEn', title: 'Última actualización', type: 'date', hidden: ({document}) => document?.plantilla !== 'legal'}),
    defineField({
      name: 'secciones',
      title: 'Secciones',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'seccionTexto',
          title: 'Texto con título',
          type: 'object',
          fields: [
            defineField({name: 'titulo', title: 'Título (h2)', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'cuerpo', title: 'Texto', type: 'cuerpo'}),
          ],
          preview: {select: {title: 'titulo'}, prepare: ({title}) => ({title, subtitle: 'Texto con título'})},
        }),
        defineArrayMember({
          name: 'seccionPilares',
          title: 'Pilares',
          type: 'object',
          fields: [
            defineField({name: 'titulo', title: 'Título (h2)', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'items',
              title: 'Pilares',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'pilar',
                  fields: [
                    defineField({name: 'titulo', title: 'Título (h3)', type: 'string', validation: (r) => r.required()}),
                    defineField({name: 'texto', title: 'Texto', type: 'text', rows: 2}),
                    defineField({name: 'enlace', title: 'Enlace', type: 'string', description: 'Ruta interna, ej.: /actualidad'}),
                  ],
                }),
              ],
              validation: (r) => r.max(4),
            }),
          ],
          preview: {select: {title: 'titulo'}, prepare: ({title}) => ({title, subtitle: 'Pilares'})},
        }),
        defineArrayMember({
          name: 'seccionMisionVision',
          title: 'Misión y visión',
          type: 'object',
          fields: [
            defineField({name: 'misionTitular', title: 'Misión · titular', type: 'string'}),
            defineField({name: 'misionTexto', title: 'Misión · texto', type: 'text', rows: 3}),
            defineField({name: 'visionTitular', title: 'Visión · titular', type: 'string'}),
            defineField({name: 'visionTexto', title: 'Visión · texto', type: 'text', rows: 3}),
          ],
          preview: {prepare: () => ({title: 'Misión y visión'})},
        }),
        defineArrayMember({
          name: 'seccionContacto',
          title: 'Llamado a contacto',
          type: 'object',
          fields: [
            defineField({name: 'titulo', title: 'Título (h2)', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'texto', title: 'Texto', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'titulo'}, prepare: ({title}) => ({title, subtitle: 'Contacto'})},
        }),
      ],
    }),
  ],
  preview: {select: {title: 'titulo', subtitle: 'plantilla'}},
})
