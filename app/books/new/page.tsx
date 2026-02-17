import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BookForm from '@/components/BookForm'

export const dynamic = 'force-dynamic'

export default async function NewBookPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div>
      <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 mb-6 inline-block">
        &larr; Back to books
      </Link>
      <h1 className="text-2xl font-bold mb-6">Add a New Book</h1>
      <BookForm mode="create" />
    </div>
  )
}
