import Link from 'next/link'
import {NavLinks} from './NavLinks'
import {isDemo} from '@/sanity/env'

export function SiteHeader({instagram}: {instagram?: string}) {
  return (
    <>
      {isDemo ? <p className="demo-banner">Modo demo: el sitio muestra datos de ejemplo hasta conectar Sanity.</p> : null}
      <header className="site-header">
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <div className="container site-header__inner">
          <Link className="site-header__logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.svg" alt="femtenis.cl, ir al inicio" width={147} height={28} />
          </Link>
          <NavLinks instagram={instagram} />
        </div>
      </header>
    </>
  )
}
