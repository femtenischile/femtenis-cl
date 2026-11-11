'use client'

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
  const activo = (href: string) => (href === '/' ? path === '/' : path.startsWith(href.replace(/\/$/, '')))
  return (
    <nav aria-label="Principal">
      <ul className="nav-list">
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
              className="icon-link"
              href={instagram}
              aria-label="Instagram de femtenis.cl"
              style={{display: 'inline-flex', alignItems: 'center', width: 'auto', height: 'auto', padding: '6px 0', borderBottom: '3px solid transparent'}}
            >
              <InstagramIcon />
            </a>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
