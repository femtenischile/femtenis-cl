import {jugadora} from './jugadora'
import {rankingSemanal} from './rankingSemanal'
import {ranking} from './ranking'
import {torneo} from './torneo'
import {participacion} from './participacion'
import {partido} from './partido'
import {imagenConCredito} from './imagenConCredito'
import {cuerpo} from './cuerpo'
import {autora} from './autora'
import {articulo} from './articulo'
import {pagina} from './pagina'
import {portada} from './portada'
import {sitio} from './sitio'

export const schemaTypes = [
  imagenConCredito,
  cuerpo,
  jugadora,
  ranking,
  rankingSemanal, // formato antiguo: ya no aparece en el menú
  torneo,
  participacion,
  partido,
  autora,
  articulo,
  pagina,
  portada,
  sitio,
]
