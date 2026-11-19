import {defineArrayMember, defineField, defineType} from 'sanity'
import {MODALIDADES} from './opciones'

/**
 * Un documento por semana con todas las jugadoras.
 * Cada lunes: abrir el ranking de la semana anterior → menú "…" → Duplicar → cambiar la fecha y los puestos → Publicar.
 * La variación se calcula comparando con el ranking de la semana anterior.
 */
export const ranking = defineType({
  name: 'ranking',
  title: 'Ranking de la semana',
  type: 'document',
  fields: [
    defineField({
      name: 'semana',
      title: 'Semana (lunes de publicación del ranking WTA)',
      type: 'date',
      options: {dateFormat: 'DD-MM-YYYY'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'modalidad',
      title: 'Modalidad',
      type: 'string',
      options: {list: MODALIDADES, layout: 'radio', direction: 'horizontal'},
      initialValue: 'singles',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'filas',
      title: 'Jugadoras',
      description: 'Una fila por jugadora. El orden no importa: el sitio las ordena por puesto.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'fila',
          title: 'Jugadora',
          type: 'object',
          fields: [
            defineField({
              name: 'jugadora',
              title: 'Jugadora',
              type: 'reference',
              to: [{type: 'jugadora'}],
              options: {filter: 'seguida == true'},
              validation: (r) => r.required(),
            }),
            defineField({name: 'puesto', title: 'Puesto WTA', type: 'number', validation: (r) => r.required().integer().min(1)}),
            defineField({name: 'puntos', title: 'Puntos', type: 'number', validation: (r) => r.integer().min(0)}),
            defineField({
              name: 'puestoAnterior',
              title: 'Puesto semana anterior (opcional)',
              description: 'Déjalo vacío: se toma solo del ranking de la semana anterior. Úsalo solo si esa semana no está cargada en el Studio.',
              type: 'number',
              validation: (r) => r.integer().min(1),
            }),
          ],
          preview: {
            select: {nombre: 'jugadora.nombre', apellido: 'jugadora.apellido', puesto: 'puesto', puntos: 'puntos'},
            prepare: ({nombre, apellido, puesto, puntos}) => ({
              title: `#${puesto ?? '—'} · ${nombre ?? ''} ${apellido ?? ''}`,
              subtitle: puntos != null ? `${puntos} puntos` : undefined,
            }),
          },
        }),
      ],
      validation: (r) =>
        r.min(1).custom((filas?: {jugadora?: {_ref?: string}}[]) => {
          const refs = (filas ?? []).map((f) => f.jugadora?._ref).filter(Boolean)
          return new Set(refs).size === refs.length ? true : 'Hay una jugadora repetida en la lista.'
        }),
    }),
  ],
  orderings: [{title: 'Semana, más reciente', name: 'semanaDesc', by: [{field: 'semana', direction: 'desc'}]}],
  preview: {
    select: {semana: 'semana', modalidad: 'modalidad', filas: 'filas'},
    prepare: ({semana, modalidad, filas}) => {
      const fecha = semana ? semana.split('-').reverse().join('-') : 'Sin fecha'
      return {
        title: `Semana del ${fecha}`,
        subtitle: `${modalidad === 'dobles' ? 'Dobles' : 'Singles'} · ${filas?.length ?? 0} jugadoras`,
      }
    },
  },
})
