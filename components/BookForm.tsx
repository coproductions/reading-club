'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Book, GoogleBookResult } from '@/lib/types'
import BookSearch from './BookSearch'
import StarRating from './StarRating'

interface BookFormProps {
  mode: 'create' | 'edit'
  book?: Book
}

export default function BookForm({ mode, book }: BookFormProps) {
  const [title, setTitle] = useState(book?.title ?? '')
  const [author, setAuthor] = useState(book?.author ?? '')
  const [coverUrl, setCoverUrl] = useState(book?.cover_url ?? '')
  const [googleBooksId, setGoogleBooksId] = useState(book?.google_books_id ?? '')
  const [status, setStatus] = useState<Book['status']>(book?.status ?? 'want_to_read')
  const [startDate, setStartDate] = useState(book?.start_date ?? '')
  const [endDate, setEndDate] = useState(book?.end_date ?? '')
  const [rating, setRating] = useState<number | null>(book?.rating ?? null)
  const [review, setReview] = useState(book?.review ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const handleBookSelect = (result: GoogleBookResult) => {
    setTitle(result.title)
    setAuthor(result.author)
    setCoverUrl(result.coverUrl ?? '')
    setGoogleBooksId(result.googleBooksId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const bookData = {
      title,
      author,
      cover_url: coverUrl || null,
      google_books_id: googleBooksId || null,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
      rating: rating,
      review: review || null,
    }

    if (mode === 'create') {
      const { data, error: err } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single()

      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
      router.push(`/books/${data.id}`)
    } else {
      const { error: err } = await supabase
        .from('books')
        .update(bookData)
        .eq('id', book!.id)

      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
      router.push(`/books/${book!.id}`)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
      {mode === 'create' && (
        <BookSearch onSelect={handleBookSelect} />
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-stone-700 mb-1">
            Author *
          </label>
          <input
            id="author"
            type="text"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="coverUrl" className="block text-sm font-medium text-stone-700 mb-1">
          Cover Image URL
        </label>
        <input
          id="coverUrl"
          type="text"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="Auto-filled from search or paste a URL"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-stone-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Book['status'])}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent bg-white"
          >
            <option value="want_to_read">Want to Read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-stone-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-stone-700 mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          />
        </div>
      </div>

      {(status === 'completed' || rating) && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
          <StarRating rating={rating} onChange={setRating} size="md" />
        </div>
      )}

      <div>
        <label htmlFor="review" className="block text-sm font-medium text-stone-700 mb-1">
          Review
        </label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          placeholder="What did we think of this book?"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : mode === 'create' ? 'Add Book' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
