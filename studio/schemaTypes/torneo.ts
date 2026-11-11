import {defineField, defineType} from 'sanity'
import {PAISES} from './opciones'

export const torneo = defineType({
  name: 'torneo',
  title: 'Torneo',
  type: 'document',
  fields: [
    defineField({name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Incluye el año, porque el torneo se repite: w25-santiago-2026',
      options: {source: (doc: any) => `${doc.nombre ?? ''} ${(doc.fechaInicio ?? '').slice(0, 4)}`},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: ['ITF W15', 'ITF W25', 'ITF W35', 'ITF W50', 'ITF W75', 'ITF W100', 'WTA 125', 'WTA 250', 'WTA 500', 'WTA 1000', 'Grand Slam', 'ITF Junior', 'Nacional'],
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'sede', title: 'Sede (club)', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'ciudad', title: 'Ciudad', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'pais', title: 'País', type: 'string', options: {list: PAISES}, initialValue: 'CHI'}),
    defineField({
      name: 'superficie',
      title: 'Superficie',
      type: 'string',
      options: {list: ['Arcilla', 'Dura', 'Césped', 'Césped sintético'], layout: 'radio'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'bajoTecho', title: 'Bajo techo', type: 'boolean', initialValue: false}),
    defineField({name: 'fechaInicio', title: 'Fecha de inicio', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'fechaFin', title: 'Fecha de término', type: 'date'}),
    defineField({name: 'webOficial', title: 'Web oficial', type: 'url'}),
  ],
  orderings: [{title: 'Fecha', name: 'fecha', by: [{field: 'fechaInicio', direction: 'asc'}]}],
  preview: {
    select: {title: 'nombre', fecha: 'fechaInicio', sede: 'sede'},
    prepare: ({title, fecha, sede}) => ({title, subtitle: [fecha, sede].filter(Boolean).join(' · ')}),
  },
})
