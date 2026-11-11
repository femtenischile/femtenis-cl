import Link from 'next/link'
import {InstagramIcon} from './Arrow'
import type {Sitio} from '@/sanity/types'

export function SiteFooter({sitio}: {sitio: Sitio}) {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <nav aria-label="Sobre el sitio">
            <ul className="plain footer-links">
              <li>
                <Link href="/sobre/">Sobre FemTenisChile</Link>
              </li>
              {sitio.correoContacto ? (
                <li>
                  <a href={`mailto:${sitio.correoContacto}`}>Correo electrónico</a>
                </li>
              ) : null}
            </ul>
          </nav>
          <Link className="site-footer__logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-dark.svg" alt="femtenis.cl, ir al inicio" width={168} height={32} />
          </Link>
          {sitio.instagram ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start'}}>
              <p className="overline" style={{color: 'var(--lime-400)'}}>
                Síguenos
              </p>
              <a href={sitio.instagram} className="icon-link" aria-label="Instagram de femtenis.cl" style={{border: '1px solid var(--purple-800)', color: 'var(--snow-50)'}}>
                <InstagramIcon size={18} />
              </a>
            </div>
          ) : null}
        </div>
        <div className="site-footer__bottom">
          <p>
            © {year} {sitio.copyright ?? 'FemTenisChile. Todos los derechos reservados.'}
          </p>
          <nav aria-label="Legal">
            <ul className="footer-legal">
              <li>
                <Link href="/privacidad/">Políticas de privacidad</Link>
              </li>
              <li>
                <Link href="/terminos/">Términos y condiciones</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
