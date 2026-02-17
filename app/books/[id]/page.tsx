import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Book, VocabWord } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import StarRating from '@/components/StarRating'
import VocabList from '@/components/VocabList'
import VocabAddForm from '@/components/VocabAddForm'
import BookActions from '@/components/BookActions'

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (!book) notFound()

  const { data: words } = await supabase
    .from('vocab_words')
    .select('*')
    .eq('book_id', id)
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  const typedBook = book as Book
  const typedWords = (words ?? []) as VocabWord[]
  const learnedCount = typedWords.filter((w) => w.learned).length

  return (
    <div>
      <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 mb-6 inline-block">
        &larr; Back to books
      </Link>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 sm:flex gap-6">
          <div className="sm:w-40 flex-shrink-0 mb-4 sm:mb-0">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-stone-100">
              {typedBook.cover_url ? (
                <Image
                  src={typedBook.cover_url}
                  alt={typedBook.title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-100">
                  <span className="text-5xl">&#x1F4DA;</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusBadge status={typedBook.status} />
                <h1 className="text-2xl font-bold mt-2">{typedBook.title}</h1>
                <p className="text-stone-500 mt-0.5">{typedBook.author}</p>
              </div>
              {user && <BookActions bookId={typedBook.id} />}
            </div>

            {typedBook.rating && (
              <div className="mt-3">
                <StarRating rating={typedBook.rating} size="md" />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone-500">
              {typedBook.start_date && (
                <span>Started: {new Date(typedBook.start_date).toLocaleDateString()}</span>
              )}
              {typedBook.end_date && (
                <span>Finished: {new Date(typedBook.end_date).toLocaleDateString()}</span>
              )}
            </div>

            {typedBook.review && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-stone-700 mb-1">Our Review</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{typedBook.review}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vocabulary Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Vocabulary</h2>
            <p className="text-sm text-stone-500">
              {typedWords.length} word{typedWords.length !== 1 ? 's' : ''}
              {typedWords.length > 0 && ` \u00b7 ${learnedCount} learned`}
            </p>
          </div>
          {typedWords.length > 0 && (
            <Link
              href={`/flashcards/${typedBook.id}`}
              className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
            >
              Practice Flashcards
            </Link>
          )}
        </div>

        {user && <VocabAddForm bookId={typedBook.id} />}

        <VocabList words={typedWords} isAuthenticated={!!user} />
      </div>
    </div>
  )
}
