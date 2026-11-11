import {defineField, defineType} from 'sanity'
import {PAISES} from './opciones'

export const jugadora = defineType({
  name: 'jugadora',
  title: 'Jugadora',
  type: 'document',
  description: 'Chilenas que sigue el medio y también sus rivales. No hay página de perfil: el nombre lleva a las notas donde aparece.',
  fields: [
    defineField({name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'apellido', title: 'Apellido', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'nacionalidad',
      title: 'Nacionalidad',
      type: 'string',
      options: {list: PAISES},
      initialValue: 'CHI',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'seguida',
      title: '¿El medio la sigue?',
      type: 'boolean',
      description: 'Actívalo para chilenas: aparece en el ranking, el carrusel y el filtro de notas.',
      initialValue: true,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Se usa para filtrar notas: /actualidad?jugadora=antonia-vergara',
      options: {source: (doc: any) => `${doc.nombre ?? ''} ${doc.apellido ?? ''}`},
      hidden: ({document}) => !document?.seguida,
    }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Texto alternativo', type: 'string'})],
    }),
    defineField({
      name: 'etapa',
      title: 'Etapa',
      type: 'string',
      options: {list: ['profesional', 'universitaria', 'junior'], layout: 'radio'},
    }),
    defineField({name: 'wtaId', title: 'ID WTA', type: 'string'}),
    defineField({name: 'itfId', title: 'ID ITF', type: 'string'}),
  ],
  preview: {
    select: {nombre: 'nombre', apellido: 'apellido', pais: 'nacionalidad', media: 'foto', seguida: 'seguida'},
    prepare: ({nombre, apellido, pais, media, seguida}) => ({
      title: `${nombre ?? ''} ${apellido ?? ''}`.trim(),
      subtitle: `${pais ?? ''}${seguida ? ' · seguida' : ''}`,
      media,
    }),
  },
})
