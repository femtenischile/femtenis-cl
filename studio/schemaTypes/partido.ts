import {defineArrayMember, defineField, defineType} from 'sanity'
import {MODALIDADES, RONDAS} from './opciones'

export const partido = defineType({
  name: 'partido',
  title: 'Partido',
  type: 'document',
  fields: [
    defineField({name: 'torneo', title: 'Torneo', type: 'reference', to: [{type: 'torneo'}], validation: (r) => r.required()}),
    defineField({name: 'ronda', title: 'Ronda', type: 'string', options: {list: RONDAS}, validation: (r) => r.required()}),
    defineField({name: 'modalidad', title: 'Modalidad', type: 'string', options: {list: MODALIDADES, layout: 'radio'}, initialValue: 'singles'}),
    defineField({name: 'jugadoraA', title: 'Jugadora A', type: 'reference', to: [{type: 'jugadora'}], validation: (r) => r.required()}),
    defineField({
      name: 'jugadoraB',
      title: 'Jugadora B',
      type: 'reference',
      to: [{type: 'jugadora'}],
      description: 'Déjalo vacío si la rival aún no se conoce: se mostrará "Rival por confirmar".',
    }),
    defineField({name: 'rankingA', title: 'Ranking de A el día del partido', type: 'number'}),
    defineField({name: 'rankingB', title: 'Ranking de B el día del partido', type: 'number'}),
    defineField({
      name: 'inicio',
      title: 'Fecha y hora de inicio',
      type: 'datetime',
      description: 'Ingresa la hora de Chile. Si no hay hora, deja solo la fecha y marca "Hora por confirmar".',
    }),
    defineField({name: 'horaPorConfirmar', title: 'Hora por confirmar', type: 'boolean', initialValue: false}),
    defineField({name: 'cancha', title: 'Cancha', type: 'string'}),
    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      options: {list: ['programado', 'en juego', 'finalizado', 'retiro', 'w.o.', 'suspendido']},
      initialValue: 'programado',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'marcador',
      title: 'Marcador',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'set',
          fields: [
            defineField({name: 'a', title: 'Games A', type: 'number'}),
            defineField({name: 'b', title: 'Games B', type: 'number'}),
            defineField({name: 'tiebreak', title: 'Tie-break (puntos de la perdedora)', type: 'number'}),
          ],
          preview: {select: {a: 'a', b: 'b', tb: 'tiebreak'}, prepare: ({a, b, tb}) => ({title: `${a}-${b}${tb != null ? ` (${tb})` : ''}`})},
        }),
      ],
      hidden: ({document}) => document?.estado === 'programado',
    }),
    defineField({name: 'ganadora', title: 'Ganadora', type: 'reference', to: [{type: 'jugadora'}], hidden: ({document}) => document?.estado === 'programado'}),
  ],
  orderings: [{title: 'Inicio', name: 'inicio', by: [{field: 'inicio', direction: 'asc'}]}],
  preview: {
    select: {a: 'jugadoraA.apellido', b: 'jugadoraB.apellido', torneo: 'torneo.nombre', ronda: 'ronda'},
    prepare: ({a, b, torneo, ronda}) => ({title: `${a ?? '?'} vs. ${b ?? 'por confirmar'}`, subtitle: `${torneo ?? ''} · ${ronda ?? ''}`}),
  },
})
