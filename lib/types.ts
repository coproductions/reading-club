export interface Book {
  id: string
  title: string
  author: string
  cover_url: string | null
  google_books_id: string | null
  status: 'reading' | 'completed' | 'want_to_read'
  start_date: string | null
  end_date: string | null
  rating: number | null
  review: string | null
  created_at: string
  updated_at: string
}

export interface VocabWord {
  id: string
  book_id: string
  word: string
  definition: string | null
  part_of_speech: string | null
  phonetic: string | null
  example: string | null
  learned: boolean
  created_at: string
  book_title?: string
}

export interface FlashcardProgress {
  id: string
  vocab_word_id: string
  times_tested: number
  times_correct: number
  last_tested: string | null
}

export interface GoogleBookResult {
  googleBooksId: string
  title: string
  author: string
  coverUrl: string | null
  publishedDate: string | null
}

export interface DictionaryResult {
  word: string
  phonetic: string | null
  partOfSpeech: string | null
  definition: string | null
  example: string | null
  allMeanings: {
    partOfSpeech: string
    definitions: {
      definition: string
      example: string | null
    }[]
  }[]
}
