import {defineField, defineType} from 'sanity'

export const autora = defineType({
  name: 'autora',
  title: 'Autora',
  type: 'document',
  fields: [
    defineField({name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'nombre'}, validation: (r) => r.required()}),
    defineField({name: 'rol', title: 'Rol', type: 'string', description: 'Periodista, colaboradora, fotógrafa…'}),
    defineField({name: 'bio', title: 'Bio breve', type: 'text', rows: 3, validation: (r) => r.max(300)}),
    defineField({name: 'foto', title: 'Foto', type: 'image', options: {hotspot: true}}),
    defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
  ],
  preview: {select: {title: 'nombre', subtitle: 'rol', media: 'foto'}},
})
