'use client'

import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react'

type Props = {
  id: string
  titulo: ReactNode
  etiqueta: string
  children: ReactNode
}

/** Carrusel horizontal con flechas. Usa scroll nativo con scroll-snap: también funciona con el dedo, el trackpad y el teclado. */
export function Carrusel({id, titulo, etiqueta, children}: Props) {
  const pista = useRef<HTMLUListElement>(null)
  const [estado, setEstado] = useState({inicio: true, fin: true})

  const medir = useCallback(() => {
    const el = pista.current
    if (!el) return
    setEstado({inicio: el.scrollLeft <= 1, fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1})
  }, [])

  useEffect(() => {
    medir()
    const el = pista.current
    el?.addEventListener('scroll', medir, {passive: true})
    window.addEventListener('resize', medir)
    return () => {
      el?.removeEventListener('scroll', medir)
      window.removeEventListener('resize', medir)
    }
  }, [medir])

  const mover = (dir: 1 | -1) => {
    const el = pista.current
    if (!el) return
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({left: dir * el.clientWidth, behavior: suave ? 'smooth' : 'auto'})
  }

  const hayMas = !(estado.inicio && estado.fin)

  return (
    <>
      <div className="section-head">
        {titulo}
        {hayMas ? (
          <div className="carrusel__controles">
            <button type="button" className="carrusel__btn" aria-label={`${etiqueta} anteriores`} aria-controls={id} disabled={estado.inicio} onClick={() => mover(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" className="carrusel__btn carrusel__btn--siguiente" aria-label={`${etiqueta} siguientes`} aria-controls={id} disabled={estado.fin} onClick={() => mover(1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
      <ul id={id} ref={pista} className="plain carrusel__pista">
        {children}
      </ul>
    </>
  )
}
