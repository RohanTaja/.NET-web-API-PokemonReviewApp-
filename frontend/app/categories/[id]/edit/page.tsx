'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { categoryApi } from '@/lib/api'

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<number | null>(null)

  useEffect(() => {
    params.then(({ id: idParam }) => {
      setId(parseInt(idParam))
    })
  }, [params])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return
      try {
        const category = await categoryApi.getById(id)
        setName(category.name)
      } catch (err) {
        setError('Failed to load category data')
      }
    }
    fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setLoading(true)
    setError('')

    try {
      await categoryApi.update(id, { id, name })
      router.push('/categories')
      router.refresh()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  if (!id) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Category</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Category'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

