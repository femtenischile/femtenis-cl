import type {NextConfig} from 'next'

// Sitio 100 % estático: `next build` genera la carpeta out/ que Cloudflare sirve como assets.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {unoptimized: true},
  // Los tipos se revisan con `npm run typecheck`; así un detalle de tipos no bloquea una publicación.
  typescript: {ignoreBuildErrors: true},
}

export default nextConfig
