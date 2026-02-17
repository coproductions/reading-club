import { createServerClient } from '@/lib/supabase/server'
import type { Book } from '@/lib/types'
import BookCard from '@/components/BookCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: filterStatus } = await searchParams
  const supabase = await createServerClient()

  let query = supabase.from('books').select('*')
  if (filterStatus && filterStatus !== 'all') {
    query = query.eq('status', filterStatus)
  }

  const { data: books } = await query.order('updated_at', { ascending: false })
  const { data: { user } } = await supabase.auth.getUser()

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Reading', value: 'reading' },
    { label: 'Completed', value: 'completed' },
    { label: 'Want to Read', value: 'want_to_read' },
  ]

  const activeFilter = filterStatus || 'all'

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Our Books</h1>
          <p className="text-stone-500 mt-1">Daddy & Phia&apos;s reading adventures</p>
        </div>
        {user && (
          <Link
            href="/books/new"
            className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
          >
            + Add Book
          </Link>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'all' ? '/' : `/?status=${f.value}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === f.value
                ? 'bg-amber-700 text-white'
                : 'bg-white text-stone-600 hover:bg-amber-100'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {(!books || books.length === 0) ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">&#x1F4DA;</span>
          <h2 className="text-xl font-heading font-semibold text-stone-700 mb-2">
            No books yet
          </h2>
          <p className="text-stone-500">
            {user
              ? 'Start your reading journey by adding your first book!'
              : 'Check back soon for our reading list!'}
          </p>
          {user && (
            <Link
              href="/books/new"
              className="inline-block mt-4 bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-amber-800 transition-colors"
            >
              Add Your First Book
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(books as Book[]).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
