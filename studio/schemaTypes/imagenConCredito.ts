import {defineField, defineType} from 'sanity'

// Imagen con los campos que exige el modelo: alt obligatorio y crédito
export const imagenConCredito = defineType({
  name: 'imagenConCredito',
  title: 'Imagen',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      description: 'Describe la imagen para quien no la ve. Sin este texto no se puede publicar.',
      validation: (r) => r.required(),
    }),
    defineField({name: 'credito', title: 'Crédito', type: 'string', description: 'Ej.: Foto: Nombre Apellido'}),
    defineField({name: 'pie', title: 'Pie de foto', type: 'string'}),
  ],
})
