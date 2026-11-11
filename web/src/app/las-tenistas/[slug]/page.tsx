import {ArticuloPagina, metadataArticulo, paramsDe} from '@/components/ArticuloPagina'

export const dynamicParams = false
export const generateStaticParams = () => paramsDe('las-tenistas')
export const generateMetadata = ({params}: {params: Promise<{slug: string}>}) => metadataArticulo('las-tenistas', params)

export default async function Page({params}: {params: Promise<{slug: string}>}) {
  return <ArticuloPagina seccion="las-tenistas" slug={(await params).slug} />
}
