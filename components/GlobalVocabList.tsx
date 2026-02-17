'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { VocabWord, Book } from '@/lib/types'

interface GlobalVocabListProps {
  words: VocabWord[]
  books: Pick<Book, 'id' | 'title'>[]
  isAuthenticated: boolean
}

export default function GlobalVocabList({ words, books, isAuthenticated }: GlobalVocabListProps) {
  const [filterBookId, setFilterBookId] = useState<string>('all')
  const supabase = createClient()
  const router = useRouter()

  const filteredWords = filterBookId === 'all'
    ? words
    : words.filter((w) => w.book_id === filterBookId)

  const toggleLearned = async (word: VocabWord) => {
    await supabase
      .from('vocab_words')
      .update({ learned: !word.learned })
      .eq('id', word.id)
    router.refresh()
  }

  const deleteWord = async (wordId: string) => {
    await supabase.from('vocab_words').delete().eq('id', wordId)
    router.refresh()
  }

  return (
    <div>
      {/* Book filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterBookId('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filterBookId === 'all'
              ? 'bg-amber-700 text-white'
              : 'bg-white text-stone-600 hover:bg-amber-100'
          }`}
        >
          All Books ({words.length})
        </button>
        {books.map((book) => {
          const count = words.filter((w) => w.book_id === book.id).length
          if (count === 0) return null
          return (
            <button
              key={book.id}
              onClick={() => setFilterBookId(book.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterBookId === book.id
                  ? 'bg-amber-700 text-white'
                  : 'bg-white text-stone-600 hover:bg-amber-100'
              }`}
            >
              {book.title} ({count})
            </button>
          )
        })}
      </div>

      {/* Word list */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <span className="text-3xl block mb-2">&#x1F4DD;</span>
          <p className="text-sm">No vocabulary words yet. Add words from your book pages!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className={`bg-white rounded-lg shadow-sm p-3 flex items-start gap-3 ${
                word.learned ? 'opacity-60' : ''
              }`}
            >
              {isAuthenticated && (
                <button
                  onClick={() => toggleLearned(word)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    word.learned
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'border-stone-300 hover:border-amber-600'
                  }`}
                  title={word.learned ? 'Mark as unlearned' : 'Mark as learned'}
                >
                  {word.learned && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`font-semibold text-sm ${word.learned ? 'line-through' : ''}`}>
                    {word.word}
                  </span>
                  {word.phonetic && (
                    <span className="text-xs text-stone-400">{word.phonetic}</span>
                  )}
                  {word.part_of_speech && (
                    <span className="text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {word.part_of_speech}
                    </span>
                  )}
                  {word.book_title && (
                    <Link
                      href={`/books/${word.book_id}`}
                      className="text-xs text-stone-400 hover:text-amber-700 transition-colors"
                    >
                      from {word.book_title}
                    </Link>
                  )}
                </div>
                {word.definition && (
                  <p className="text-sm text-stone-600 mt-0.5">{word.definition}</p>
                )}
                {word.example && (
                  <p className="text-xs text-stone-400 mt-0.5 italic">&ldquo;{word.example}&rdquo;</p>
                )}
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => deleteWord(word.id)}
                  className="text-stone-300 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Delete word"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
