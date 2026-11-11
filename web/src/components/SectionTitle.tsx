import type {ReactNode} from 'react'

type Level = 2 | 3
export function Heading({level, id, className, children}: {level: Level; id?: string; className?: string; children: ReactNode}) {
  const Tag = `h${level}` as const
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  )
}
