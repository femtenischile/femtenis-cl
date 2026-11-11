import type {Metadata} from 'next'
import {Anton, Inter, JetBrains_Mono} from 'next/font/google'
import {SiteHeader} from '@/components/SiteHeader'
import {SiteFooter} from '@/components/SiteFooter'
import {getSitio} from '@/sanity/queries'
import './globals.css'

const anton = Anton({subsets: ['latin'], weight: '400', variable: '--font-anton', display: 'swap'})
const inter = Inter({subsets: ['latin'], variable: '--font-inter', display: 'swap'})
const mono = JetBrains_Mono({subsets: ['latin'], weight: ['500', '700'], variable: '--font-jetbrains', display: 'swap'})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://femtenis.cl'

export async function generateMetadata(): Promise<Metadata> {
  const sitio = await getSitio()
  const nombre = sitio.nombre ?? 'femtenis.cl'
  return {
    metadataBase: new URL(SITE_URL),
    title: {default: `${nombre} · Tenis femenino chileno`, template: `%s · ${nombre}`},
    description: sitio.descripcion,
    openGraph: {siteName: nombre, locale: 'es_CL', type: 'website'},
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const sitio = await getSitio()
  return (
    <html lang="es-CL" className={`${anton.variable} ${inter.variable} ${mono.variable}`}>
      <body className="site">
        {/* Le dice a Google el nombre del sitio y sus variantes (femtenis, FemTenisChile) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'femtenis.cl',
              alternateName: ['femtenis', 'FemTenisChile', 'Fem Tenis Chile'],
              url: `${SITE_URL}/`,
            }),
          }}
        />
        <SiteHeader instagram={sitio.instagram} />
        <main id="contenido">{children}</main>
        <SiteFooter sitio={sitio} />
      </body>
    </html>
  )
}
