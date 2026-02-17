'use client'

interface StarRatingProps {
  rating: number | null
  onChange?: (rating: number) => void
  size?: 'sm' | 'md'
}

export default function StarRating({ rating, onChange, size = 'sm' }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5]
  const sizeClass = size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className={`${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <span className={star <= (rating ?? 0) ? 'text-amber-600' : 'text-stone-300'}>
            &#9733;
          </span>
        </button>
      ))}
    </div>
  )
}
