import {defineField, defineType} from 'sanity'

export const sitio = defineType({
  name: 'sitio',
  title: 'Ajustes del sitio',
  type: 'document',
  fields: [
    defineField({name: 'nombre', title: 'Nombre del sitio', type: 'string', initialValue: 'femtenis.cl'}),
    defineField({name: 'descripcion', title: 'Descripción para buscadores', type: 'text', rows: 2}),
    defineField({name: 'correoContacto', title: 'Correo de contacto', type: 'string', validation: (r) => r.email()}),
    defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
    defineField({name: 'copyright', title: 'Texto de copyright', type: 'string', initialValue: 'FemTenisChile. Todos los derechos reservados.'}),
  ],
  preview: {prepare: () => ({title: 'Ajustes del sitio'})},
})
