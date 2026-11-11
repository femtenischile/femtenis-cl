import {defineField, defineType} from 'sanity'

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
      name: 'partidoDestacado',
      title: 'Partido destacado',
      type: 'reference',
      to: [{type: 'partido'}],
      description: 'Primera tarjeta de "Próximos torneos". Si queda vacío se usa el próximo partido de una chilena.',
    }),
  ],
  preview: {prepare: () => ({title: 'Portada'})},
})
