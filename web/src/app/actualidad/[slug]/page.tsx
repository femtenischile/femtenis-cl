import {ArticuloPagina, metadataArticulo, paramsDe} from '@/components/ArticuloPagina'

export const dynamicParams = false
export const generateStaticParams = () => paramsDe('actualidad')
export const generateMetadata = ({params}: {params: Promise<{slug: string}>}) => metadataArticulo('actualidad', params)

export default async function Page({params}: {params: Promise<{slug: string}>}) {
  return <ArticuloPagina seccion="actualidad" slug={(await params).slug} />
}
