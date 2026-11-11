import {defineField, defineType} from 'sanity'
import {MODALIDADES, RONDAS} from './opciones'

export const participacion = defineType({
  name: 'participacion',
  title: 'Participación',
  type: 'document',
  description: 'Qué jugadora seguida está inscrita en qué torneo.',
  fields: [
    defineField({name: 'torneo', title: 'Torneo', type: 'reference', to: [{type: 'torneo'}], validation: (r) => r.required()}),
    defineField({
      name: 'jugadora',
      title: 'Jugadora',
      type: 'reference',
      to: [{type: 'jugadora'}],
      options: {filter: 'seguida == true'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'modalidad', title: 'Modalidad', type: 'string', options: {list: MODALIDADES, layout: 'radio'}, initialValue: 'singles'}),
    defineField({
      name: 'cuadro',
      title: 'Cuadro',
      type: 'string',
      options: {list: [{title: 'Principal', value: 'principal'}, {title: 'Clasificación', value: 'clasificacion'}], layout: 'radio'},
      initialValue: 'principal',
    }),
    defineField({name: 'cabezaDeSerie', title: 'Cabeza de serie', type: 'number'}),
    defineField({
      name: 'resultado',
      title: 'Resultado (ronda alcanzada)',
      type: 'string',
      options: {list: [...RONDAS, {title: 'Campeona', value: 'campeona'}]},
    }),
  ],
  preview: {
    select: {nombre: 'jugadora.nombre', apellido: 'jugadora.apellido', torneo: 'torneo.nombre'},
    prepare: ({nombre, apellido, torneo}) => ({title: `${nombre ?? ''} ${apellido ?? ''}`, subtitle: torneo}),
  },
})
