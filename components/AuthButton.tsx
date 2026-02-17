'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) return null

  if (user) {
    return (
      <button
        onClick={async () => {
          await supabase.auth.signOut()
          router.refresh()
        }}
        className="text-sm text-stone-600 hover:text-amber-700 transition-colors"
      >
        Sign out
      </button>
    )
  }

  return (
    <a
      href="/login"
      className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
    >
      Sign in
    </a>
  )
}
