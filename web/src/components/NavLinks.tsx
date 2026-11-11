'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {InstagramIcon} from './Arrow'

const LINKS = [
  {href: '/', label: 'Inicio'},
  {href: '/actualidad/', label: 'Actualidad'},
  {href: '/las-tenistas/', label: 'Las tenistas'},
  {href: '/el-circuito/', label: 'El circuito'},
  {href: '/sobre/', label: 'Sobre FemTenisChile'},
]

export function NavLinks({instagram}: {instagram?: string}) {
  const path = usePathname() || '/'
  const [abierto, setAbierto] = useState(false)
  const activo = (href: string) => (href === '/' ? path === '/' : path.startsWith(href.replace(/\/$/, '')))

  // Cierra el menú al cambiar de página
  useEffect(() => setAbierto(false), [path])

  // Cierra el menú con la tecla Escape
  useEffect(() => {
    if (!abierto) return
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [abierto])

  return (
    <nav aria-label="Principal" className="nav-principal">
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={abierto}
        aria-controls="menu-principal"
        onClick={() => setAbierto((a) => !a)}
      >
        <span className="nav-toggle__texto">{abierto ? 'Cerrar menú' : 'Menú'}</span>
        <span className="nav-toggle__icono" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <ul id="menu-principal" className={`nav-list${abierto ? ' nav-list--abierta' : ''}`}>
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} aria-current={activo(l.href) ? 'page' : undefined}>
              {l.label}
            </Link>
          </li>
        ))}
        {instagram ? (
          <li>
            <a
              className="icon-link nav-instagram"
              href={instagram}
              aria-label="Instagram de femtenis.cl"
              style={{display: 'inline-flex', alignItems: 'center', width: 'auto', height: 'auto', padding: '6px 0', borderBottom: '3px solid transparent'}}
            >
              <InstagramIcon />
              <span className="nav-instagram__texto" aria-hidden="true">
                Instagram
              </span>
            </a>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
