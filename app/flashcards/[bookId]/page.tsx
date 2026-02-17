import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Book, VocabWord } from '@/lib/types'
import FlashcardDeck from '@/components/FlashcardDeck'

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  const supabase = await createServerClient()

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single()

  if (!book) notFound()

  const { data: words } = await supabase
    .from('vocab_words')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: true })

  const typedBook = book as Book
  const typedWords = (words ?? []) as VocabWord[]

  return (
    <div>
      <Link
        href={`/books/${bookId}`}
        className="text-sm text-amber-700 hover:text-amber-800 mb-6 inline-block"
      >
        &larr; Back to {typedBook.title}
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <p className="text-stone-500 mt-1">{typedBook.title}</p>
      </div>

      <FlashcardDeck words={typedWords} bookTitle={typedBook.title} />
    </div>
  )
}
