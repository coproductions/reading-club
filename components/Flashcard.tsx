'use client'

import type { VocabWord } from '@/lib/types'

interface FlashcardProps {
  word: VocabWord
  flipped: boolean
  onFlip: () => void
  showBookTitle?: boolean
}

export default function Flashcard({ word, flipped, onFlip, showBookTitle }: FlashcardProps) {
  return (
    <div
      className="flashcard-container w-full max-w-md mx-auto cursor-pointer"
      style={{ height: '300px' }}
      onClick={onFlip}
    >
      <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
        {/* Front - Word */}
        <div className="flashcard-front bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center text-center">
          {showBookTitle && word.book_title && (
            <p className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full mb-4">
              {word.book_title}
            </p>
          )}
          <p className="text-3xl font-heading font-bold text-stone-800">{word.word}</p>
          {word.phonetic && (
            <p className="text-sm text-stone-400 mt-2">{word.phonetic}</p>
          )}
          {word.part_of_speech && (
            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-3">
              {word.part_of_speech}
            </span>
          )}
          <p className="text-xs text-stone-400 mt-6">Tap to reveal</p>
        </div>

        {/* Back - Definition */}
        <div className="flashcard-back bg-amber-50 rounded-2xl shadow-md p-8 flex flex-col items-center justify-center text-center">
          {showBookTitle && word.book_title && (
            <p className="text-xs text-amber-600 bg-white px-2.5 py-1 rounded-full mb-3">
              {word.book_title}
            </p>
          )}
          <p className="text-lg font-medium text-stone-700 leading-relaxed">
            {word.definition || 'No definition available'}
          </p>
          {word.example && (
            <p className="text-sm text-stone-500 mt-4 italic">
              &ldquo;{word.example}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
