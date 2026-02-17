import { createServerClient } from '@/lib/supabase/server'
import type { VocabWord, Book } from '@/lib/types'
import Link from 'next/link'
import GlobalVocabList from '@/components/GlobalVocabList'

export const dynamic = 'force-dynamic'

export default async function VocabPage() {
  const supabase = await createServerClient()

  const { data: words } = await supabase
    .from('vocab_words')
    .select('*, books(title)')
    .order('created_at', { ascending: false })

  const { data: books } = await supabase
    .from('books')
    .select('id, title')
    .order('title')

  const { data: { user } } = await supabase.auth.getUser()

  const typedWords: VocabWord[] = (words ?? []).map((w: Record<string, unknown>) => ({
    ...w,
    book_title: (w.books as { title: string } | null)?.title ?? undefined,
  })) as VocabWord[]

  const typedBooks = (books ?? []) as Pick<Book, 'id' | 'title'>[]
  const learnedCount = typedWords.filter((w) => w.learned).length
  const totalWords = typedWords.length

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Vocabulary</h1>
          <p className="text-stone-500 mt-1">
            {totalWords} word{totalWords !== 1 ? 's' : ''} across all books
            {totalWords > 0 && ` \u00b7 ${learnedCount} learned`}
          </p>
        </div>
        {totalWords > 0 && (
          <Link
            href="/vocab/practice"
            className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
          >
            Practice All
          </Link>
        )}
      </div>

      <GlobalVocabList
        words={typedWords}
        books={typedBooks}
        isAuthenticated={!!user}
      />
    </div>
  )
}
