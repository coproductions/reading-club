'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Books', match: (path: string) => path === '/' || path.startsWith('/books') },
  { href: '/vocab', label: 'Vocab', match: (path: string) => path.startsWith('/vocab') || path.startsWith('/flashcards') },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-4">
      {links.map((link) => {
        const isActive = link.match(pathname)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors ${
              isActive
                ? 'text-amber-700 font-medium'
                : 'text-stone-500 hover:text-amber-700'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
