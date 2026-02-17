import { createServerClient } from '@/lib/supabase/server'
import type { VocabWord } from '@/lib/types'
import Link from 'next/link'
import FlashcardDeck from '@/components/FlashcardDeck'

export const dynamic = 'force-dynamic'

export default async function GlobalPracticePage() {
  const supabase = await createServerClient()

  const { data: words } = await supabase
    .from('vocab_words')
    .select('*, books(title)')
    .order('created_at', { ascending: true })

  const typedWords: VocabWord[] = (words ?? []).map((w: Record<string, unknown>) => ({
    ...w,
    book_title: (w.books as { title: string } | null)?.title ?? undefined,
  })) as VocabWord[]

  return (
    <div>
      <Link
        href="/vocab"
        className="text-sm text-amber-700 hover:text-amber-800 mb-6 inline-block"
      >
        &larr; Back to vocabulary
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Practice All Words</h1>
        <p className="text-stone-500 mt-1">Words from all your books</p>
      </div>

      <FlashcardDeck words={typedWords} bookTitle="All Books" showBookTitle />
    </div>
  )
}
