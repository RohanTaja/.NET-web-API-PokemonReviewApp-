'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { pokemonApi, reviewApi, categoryApi } from '@/lib/api'

interface DeleteButtonProps {
  id: number
  type: 'pokemon' | 'review' | 'category'
  redirectPath: string
}

export default function DeleteButton({ id, type, redirectPath }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      switch (type) {
        case 'pokemon':
          await pokemonApi.delete(id)
          break
        case 'review':
          await reviewApi.delete(id)
          break
        case 'category':
          await categoryApi.delete(id)
          break
      }
      router.push(redirectPath)
      router.refresh()
    } catch (err) {
      alert('Failed to delete. Please try again.')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700 text-sm"
    >
      Delete
    </button>
  )
}

