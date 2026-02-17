'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DeleteButton from './DeleteButton'

export default function BookActions({ bookId }: { bookId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    await supabase.from('books').delete().eq('id', bookId)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <Link
        href={`/books/${bookId}/edit`}
        className="text-sm text-amber-700 hover:text-amber-800 font-medium"
      >
        Edit
      </Link>
      <DeleteButton onDelete={handleDelete} label="Delete" />
    </div>
  )
}
