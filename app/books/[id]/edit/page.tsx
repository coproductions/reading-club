import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import type { Book } from '@/lib/types'
import BookForm from '@/components/BookForm'

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (!book) notFound()

  return (
    <div>
      <Link href={`/books/${id}`} className="text-sm text-amber-700 hover:text-amber-800 mb-6 inline-block">
        &larr; Back to book
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      <BookForm mode="edit" book={book as Book} />
    </div>
  )
}
