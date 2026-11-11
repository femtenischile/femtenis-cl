import {defineField, defineType} from 'sanity'
import {MODALIDADES} from './opciones'

export const rankingSemanal = defineType({
  name: 'rankingSemanal',
  title: 'Ranking semanal',
  type: 'document',
  description: 'Una fila por jugadora, semana y modalidad. La variación se calcula comparando con la semana anterior.',
  fields: [
    defineField({
      name: 'jugadora',
      title: 'Jugadora',
      type: 'reference',
      to: [{type: 'jugadora'}],
      options: {filter: 'seguida == true'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'semana',
      title: 'Semana (lunes de publicación)',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'modalidad',
      title: 'Modalidad',
      type: 'string',
      options: {list: MODALIDADES, layout: 'radio'},
      initialValue: 'singles',
      validation: (r) => r.required(),
    }),
    defineField({name: 'puesto', title: 'Puesto WTA', type: 'number', validation: (r) => r.required().integer().min(1)}),
    defineField({name: 'puntos', title: 'Puntos', type: 'number', validation: (r) => r.integer().min(0)}),
  ],
  orderings: [{title: 'Semana, más reciente', name: 'semanaDesc', by: [{field: 'semana', direction: 'desc'}]}],
  preview: {
    select: {nombre: 'jugadora.nombre', apellido: 'jugadora.apellido', semana: 'semana', puesto: 'puesto'},
    prepare: ({nombre, apellido, semana, puesto}) => ({
      title: `#${puesto ?? '—'} · ${nombre ?? ''} ${apellido ?? ''}`,
      subtitle: semana,
    }),
  },
})
