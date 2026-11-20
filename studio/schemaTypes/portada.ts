import {defineArrayMember, defineField, defineType} from 'sanity'

export const portada = defineType({
  name: 'portada',
  title: 'Portada',
  type: 'document',
  fields: [
    defineField({
      name: 'articuloDestacado',
      title: 'Artículo destacado',
      type: 'reference',
      to: [{type: 'articulo'}],
      description: 'Encabeza la portada. Si queda vacío se usa el artículo más reciente.',
    }),
    defineField({
      name: 'perfilDelMes',
      title: 'Perfil del mes',
      type: 'reference',
      to: [{type: 'articulo'}],
      options: {filter: 'seccion == "las-tenistas"'},
      description: 'Encabeza Las tenistas.',
    }),
    defineField({
      name: 'jugadorasCarrusel',
      title: 'Jugadoras del carrusel',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'jugadora'}], options: {filter: 'seguida == true'}}],
      description: 'Si queda vacío se muestran las 8 mejores del ranking.',
    }),
    defineField({
      name: 'tarjetasTorneos',
      title: 'Tarjetas de "Próximos torneos"',
      description:
        'Las tarjetas que se apilan en el inicio, en este orden (arrástralas para reordenar). Si queda vacío, el bloque se arma solo con el partido destacado y los próximos torneos.',
      type: 'array',
      validation: (r) => r.max(8),
      of: [
        defineArrayMember({
          name: 'tarjetaTorneo',
          title: 'Tarjeta',
          type: 'object',
          fieldsets: [
            {name: 'izq', title: 'Lado izquierdo', options: {columns: 2}},
            {name: 'der', title: 'Lado derecho', options: {columns: 2}},
            {name: 'cuando', title: 'Fecha', options: {columns: 2}},
          ],
          fields: [
            defineField({
              name: 'torneo',
              title: 'Torneo',
              type: 'reference',
              to: [{type: 'torneo'}],
              description: 'Da el nombre, la sede y el enlace de la tarjeta.',
              validation: (r) => r.required(),
            }),
            defineField({name: 'etiqueta', title: 'Etiqueta (esquina superior derecha)', type: 'string', description: 'Ej.: R32, Partido, WTA 125. Vacío: la categoría del torneo.'}),
            defineField({name: 'detalle', title: 'Detalle (arriba a la izquierda)', type: 'string', description: 'Ej.: Primera ronda · Arcilla. Vacío: la superficie del torneo.'}),
            defineField({name: 'fecha', title: 'Día', type: 'date', fieldset: 'cuando', validation: (r) => r.required()}),
            defineField({name: 'hora', title: 'Hora (opcional)', type: 'string', fieldset: 'cuando', description: 'Ej.: 19:00'}),
            defineField({name: 'izq', title: 'Nombre', type: 'string', fieldset: 'izq', description: 'Ej.: Fernanda Labraña'}),
            defineField({name: 'notaIzq', title: 'Debajo del nombre', type: 'string', fieldset: 'izq', description: 'Ej.: CHI · #503'}),
            defineField({name: 'der', title: 'Nombre', type: 'string', fieldset: 'der', description: 'Ej.: Andrea Lázaro García'}),
            defineField({name: 'notaDer', title: 'Debajo del nombre', type: 'string', fieldset: 'der', description: 'Ej.: ESP · #140'}),
            defineField({name: 'mostrarVs', title: 'Mostrar «vs.» entre los dos lados', type: 'boolean', initialValue: true}),
          ],
          preview: {
            select: {izq: 'izq', der: 'der', torneo: 'torneo.nombre', fecha: 'fecha', vs: 'mostrarVs'},
            prepare: ({izq, der, torneo, fecha, vs}) => ({
              title: [izq, der].filter(Boolean).join(vs ? ' vs. ' : ' · ') || torneo || 'Tarjeta',
              subtitle: [torneo, fecha ? fecha.split('-').reverse().join('-') : null].filter(Boolean).join(' · '),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'partidoDestacado',
      title: 'Partido destacado',
      type: 'reference',
      to: [{type: 'partido'}],
      description: 'Primera tarjeta de "Próximos torneos" cuando las tarjetas de arriba están vacías. Si queda vacío se usa el próximo partido de una chilena.',
    }),
  ],
  preview: {prepare: () => ({title: 'Portada'})},
})
