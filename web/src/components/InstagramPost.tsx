'use client'

import {useEffect} from 'react'

declare global {
  interface Window {
    instgrm?: {Embeds: {process: () => void}}
  }
}

/** Deja el enlace limpio: https://www.instagram.com/p/CODIGO/ (sin ?utm_… ni otros parámetros). */
export function urlInstagram(url: string) {
  const m = url.match(/instagram\.com\/(p|reels?|tv)\/([A-Za-z0-9_-]+)/)
  if (!m) return url
  const tipo = m[1] === 'reels' ? 'reel' : m[1]
  return `https://www.instagram.com/${tipo}/${m[2]}/`
}

/** Post de Instagram incrustado con el código oficial de Instagram (embed.js). */
export function InstagramPost({url}: {url: string}) {
  const permalink = urlInstagram(url)

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process()
      return
    }
    if (!document.getElementById('instagram-embed')) {
      const s = document.createElement('script')
      s.id = 'instagram-embed'
      s.async = true
      s.src = 'https://www.instagram.com/embed.js'
      document.body.appendChild(s)
    }
  }, [permalink])

  return (
    <div className="ig-post">
      <blockquote className="instagram-media" data-instgrm-permalink={permalink} data-instgrm-version="14">
        <a href={permalink} target="_blank" rel="noopener noreferrer">
          Ver esta publicación en Instagram
        </a>
      </blockquote>
    </div>
  )
}
