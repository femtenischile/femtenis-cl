// Variables públicas: se pueden importar desde componentes de cliente (sin dependencias de Node).
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2025-02-19'
export const isDemo = !projectId
