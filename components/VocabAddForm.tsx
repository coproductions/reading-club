'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { DictionaryResult } from '@/lib/types'

export default function VocabAddForm({ bookId }: { bookId: string }) {
  const [word, setWord] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<DictionaryResult | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const lookupWord = async () => {
    if (!word.trim()) return
    setLoading(true)
    setError('')
    setPreview(null)

    try {
      const res = await fetch(`/api/dictionary/${encodeURIComponent(word.trim())}`)
      if (!res.ok) {
        setError('Word not found in dictionary. You can still add it manually.')
        setPreview({
          word: word.trim(),
          phonetic: null,
          partOfSpeech: null,
          definition: null,
          example: null,
          allMeanings: [],
        })
      } else {
        const data = await res.json()
        setPreview(data)
      }
    } catch {
      setError('Failed to look up word')
    }
    setLoading(false)
  }

  const saveWord = async () => {
    if (!preview) return
    setLoading(true)

    const { error: err } = await supabase.from('vocab_words').insert({
      book_id: bookId,
      word: preview.word,
      definition: preview.definition,
      part_of_speech: preview.partOfSpeech,
      phonetic: preview.phonetic,
      example: preview.example,
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setWord('')
    setPreview(null)
    setError('')
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              lookupWord()
            }
          }}
          placeholder="Add a new word..."
          className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
        />
        <button
          type="button"
          onClick={lookupWord}
          disabled={loading || !word.trim()}
          className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Look up'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {preview && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-semibold text-stone-800">{preview.word}</span>
              {preview.phonetic && (
                <span className="text-sm text-stone-500 ml-2">{preview.phonetic}</span>
              )}
              {preview.partOfSpeech && (
                <span className="text-xs text-amber-700 ml-2 bg-amber-100 px-1.5 py-0.5 rounded">
                  {preview.partOfSpeech}
                </span>
              )}
            </div>
          </div>
          {preview.definition && (
            <p className="text-sm text-stone-600 mt-1">{preview.definition}</p>
          )}
          {preview.example && (
            <p className="text-sm text-stone-500 mt-1 italic">&ldquo;{preview.example}&rdquo;</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={saveWord}
              disabled={loading}
              className="bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Word'}
            </button>
            <button
              onClick={() => { setPreview(null); setError('') }}
              className="text-sm text-stone-500 hover:text-stone-700 px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
