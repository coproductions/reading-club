'use client'

import { useState, useMemo, useCallback } from 'react'
import type { VocabWord } from '@/lib/types'
import Flashcard from './Flashcard'

interface FlashcardDeckProps {
  words: VocabWord[]
  bookTitle: string
}

type Filter = 'all' | 'unlearned'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FlashcardDeck({ words, bookTitle }: FlashcardDeckProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [shuffled, setShuffled] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [gotIt, setGotIt] = useState(0)
  const [stillLearning, setStillLearning] = useState(0)
  const [finished, setFinished] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)

  const deck = useMemo(() => {
    let filtered = filter === 'unlearned' ? words.filter((w) => !w.learned) : words
    if (shuffled) filtered = shuffle(filtered)
    return filtered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, filter, shuffled, sessionKey])

  const currentWord = deck[currentIndex]

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) setGotIt((g) => g + 1)
    else setStillLearning((s) => s + 1)

    setFlipped(false)

    if (currentIndex + 1 >= deck.length) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, deck.length])

  const restart = () => {
    setCurrentIndex(0)
    setFlipped(false)
    setGotIt(0)
    setStillLearning(0)
    setFinished(false)
    setSessionKey((k) => k + 1)
  }

  if (deck.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">&#x1F4AD;</span>
        <h2 className="text-xl font-heading font-semibold text-stone-700 mb-2">
          No words to practice
        </h2>
        <p className="text-stone-500 text-sm">
          {filter === 'unlearned'
            ? 'All words are marked as learned! Try "All words" instead.'
            : 'Add some vocabulary words to this book first.'}
        </p>
      </div>
    )
  }

  if (finished) {
    const total = gotIt + stillLearning
    const percentage = Math.round((gotIt / total) * 100)
    return (
      <div className="text-center py-12">
        <span className="text-5xl block mb-4">
          {percentage >= 80 ? '\u{1F389}' : percentage >= 50 ? '\u{1F44D}' : '\u{1F4AA}'}
        </span>
        <h2 className="text-2xl font-heading font-bold text-stone-800 mb-2">
          Session Complete!
        </h2>
        <p className="text-stone-500 mb-6">{bookTitle}</p>
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-700">{gotIt}</p>
            <p className="text-sm text-stone-500">Got it</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-700">{stillLearning}</p>
            <p className="text-sm text-stone-500">Still learning</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-stone-700">{percentage}%</p>
            <p className="text-sm text-stone-500">Score</p>
          </div>
        </div>
        <button
          onClick={restart}
          className="bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-800 transition-colors"
        >
          Practice Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => { setFilter('all'); setCurrentIndex(0); setFlipped(false) }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-amber-700 text-white' : 'bg-white text-stone-600 hover:bg-amber-100'
            }`}
          >
            All ({words.length})
          </button>
          <button
            onClick={() => { setFilter('unlearned'); setCurrentIndex(0); setFlipped(false) }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'unlearned' ? 'bg-amber-700 text-white' : 'bg-white text-stone-600 hover:bg-amber-100'
            }`}
          >
            Unlearned ({words.filter((w) => !w.learned).length})
          </button>
        </div>
        <button
          onClick={() => { setShuffled(!shuffled); setCurrentIndex(0); setFlipped(false); setSessionKey((k) => k + 1) }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            shuffled ? 'bg-amber-700 text-white' : 'bg-white text-stone-600 hover:bg-amber-100'
          }`}
        >
          Shuffle
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-stone-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-amber-700 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIndex) / deck.length) * 100}%` }}
        />
      </div>

      {/* Card counter */}
      <p className="text-center text-sm text-stone-400 mb-4">
        {currentIndex + 1} of {deck.length}
      </p>

      {/* Flashcard */}
      {currentWord && (
        <Flashcard
          word={currentWord}
          flipped={flipped}
          onFlip={() => setFlipped(!flipped)}
        />
      )}

      {/* Answer buttons */}
      {flipped && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => handleAnswer(false)}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
          >
            Still learning
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  )
}
