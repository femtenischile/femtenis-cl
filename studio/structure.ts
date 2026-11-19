import type {StructureResolver} from 'sanity/structure'

export const SINGLETONS = ['portada', 'sitio']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem().title('Portada').id('portada').child(S.document().schemaType('portada').documentId('portada')),
      S.divider(),
      S.documentTypeListItem('articulo').title('Artículos'),
      S.documentTypeListItem('autora').title('Autoras'),
      S.divider(),
      S.documentTypeListItem('jugadora').title('Jugadoras'),
      S.listItem()
        .title('Ranking semanal')
        .id('ranking')
        .schemaType('ranking')
        .child(S.documentTypeList('ranking').title('Ranking semanal').defaultOrdering([{field: 'semana', direction: 'desc'}])),
      S.documentTypeListItem('torneo').title('Torneos'),
      S.documentTypeListItem('participacion').title('Participaciones'),
      S.documentTypeListItem('partido').title('Partidos'),
      S.divider(),
      S.documentTypeListItem('pagina').title('Páginas'),
      S.listItem().title('Ajustes del sitio').id('sitio').child(S.document().schemaType('sitio').documentId('sitio')),
    ])
