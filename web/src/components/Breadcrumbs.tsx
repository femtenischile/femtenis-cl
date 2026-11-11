import Link from 'next/link'

export function Breadcrumbs({items, dark}: {items: {href?: string; label: string}[]; dark?: boolean}) {
  return (
    <nav className="breadcrumbs" aria-label="Ruta">
      <ol>
        {items.map((it, i) => (
          <li key={i}>
            {it.href ? (
              <Link href={it.href} style={dark ? {color: '#C9BEDD'} : undefined}>
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" style={dark ? {color: '#C9BEDD'} : undefined}>
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
