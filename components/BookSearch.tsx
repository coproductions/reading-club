'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { GoogleBookResult } from '@/lib/types'

interface BookSearchProps {
  onSelect: (book: GoogleBookResult) => void
}

export default function BookSearch({ onSelect }: BookSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GoogleBookResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setOpen(true)
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-stone-700 mb-1">
        Search for a book
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing a book title..."
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
      />
      {loading && (
        <div className="absolute right-3 top-8 text-xs text-stone-400">Searching...</div>
      )}

      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-stone-200 max-h-72 overflow-y-auto">
          {results.map((book) => (
            <button
              key={book.googleBooksId}
              type="button"
              onClick={() => {
                onSelect(book)
                setQuery(book.title)
                setOpen(false)
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-amber-50 transition-colors text-left border-b border-stone-100 last:border-b-0"
            >
              <div className="w-10 h-14 flex-shrink-0 relative rounded overflow-hidden bg-stone-100">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">
                    &#x1F4D6;
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{book.title}</p>
                <p className="text-xs text-stone-500 truncate">{book.author}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
