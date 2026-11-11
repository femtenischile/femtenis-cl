// Todas las fechas se muestran en hora de Chile, aunque el build corra en UTC.
const TZ = 'America/Santiago'

export function hoyISO(): string {
  return new Intl.DateTimeFormat('en-CA', {timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date())
}

export function sumarDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

const parse = (v: string) => (v.length === 10 ? new Date(`${v}T12:00:00Z`) : new Date(v))
const fmt = (v: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('es-CL', {timeZone: v.length === 10 ? 'UTC' : TZ, ...o}).format(parse(v))

/** 14 de mayo de 2026 */
export const fechaLarga = (v: string) => fmt(v, {day: 'numeric', month: 'long', year: 'numeric'})
/** 14 may 2026 */
export const fechaCorta = (v: string) => fmt(v, {day: 'numeric', month: 'short', year: 'numeric'}).replace('.', '')
/** OCT */
export const mesCorto = (v: string) => fmt(v, {month: 'short'}).replace('.', '').toUpperCase()
/** OCTUBRE */
export const mesLargo = (v: string) => fmt(v, {month: 'long'}).toUpperCase()
/** 05 */
export const dia = (v: string) => fmt(v, {day: '2-digit'})
/** SÁB */
export const diaSemana = (v: string) => fmt(v, {weekday: 'short'}).replace('.', '').toUpperCase()
/** 10:00 */
export const hora = (v: string) => fmt(v, {hour: '2-digit', minute: '2-digit', hour12: false})
