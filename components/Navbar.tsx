import Link from 'next/link'
import AuthButton from './AuthButton'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-amber-50/90 backdrop-blur-sm border-b border-amber-200/50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl">&#x1F426;&#x200D;&#x1F525;</span>
            <span className="font-heading text-lg font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
              Daddy & Phia
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-stone-500 hover:text-amber-700 transition-colors">
              Books
            </Link>
            <Link href="/vocab" className="text-sm text-stone-500 hover:text-amber-700 transition-colors">
              Vocab
            </Link>
          </div>
        </div>
        <AuthButton />
      </div>
    </nav>
  )
}
