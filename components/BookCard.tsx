import Image from 'next/image'
import Link from 'next/link'
import type { Book } from '@/lib/types'
import StatusBadge from './StatusBadge'
import StarRating from './StarRating'

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div className="relative aspect-[2/3] bg-stone-100">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-amber-100">
            <span className="text-4xl">&#x1F4DA;</span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <StatusBadge status={book.status} />
        <h3 className="font-heading font-semibold text-sm leading-tight group-hover:text-amber-700 transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-1">{book.author}</p>
        {book.status === 'completed' && book.rating && (
          <StarRating rating={book.rating} />
        )}
      </div>
    </Link>
  )
}
