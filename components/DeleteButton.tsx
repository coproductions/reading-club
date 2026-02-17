'use client'

import { useState } from 'react'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  label?: string
  confirmMessage?: string
}

export default function DeleteButton({
  onDelete,
  label = 'Delete',
  confirmMessage = 'Are you sure? This cannot be undone.',
}: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-stone-600">{confirmMessage}</span>
        <button
          onClick={async () => {
            setDeleting(true)
            await onDelete()
          }}
          disabled={deleting}
          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-red-500 hover:text-red-700 transition-colors"
    >
      {label}
    </button>
  )
}
