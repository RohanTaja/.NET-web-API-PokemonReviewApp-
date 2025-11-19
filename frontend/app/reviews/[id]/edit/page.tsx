'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { reviewApi, reviewerApi, pokemonApi } from '@/lib/api'
import { Review, Reviewer, Pokemon } from '@/types'

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<number | null>(null)

  useEffect(() => {
    params.then(({ id: idParam }) => {
      setId(parseInt(idParam))
    })
  }, [params])
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        const [review, reviewersData, pokemonsData] = await Promise.all([
          reviewApi.getById(id),
          reviewerApi.getAll(),
          pokemonApi.getAll(),
        ])
        setTitle(review.title)
        setText(review.text)
        setRating(review.rating)
        setReviewers(reviewersData)
        setPokemons(pokemonsData)
      } catch (err) {
        setError('Failed to load review data')
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setLoading(true)
    setError('')

    try {
      await reviewApi.update(id, {
        id,
        title,
        text,
        rating,
      })
      router.push('/reviews')
      router.refresh()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update review')
    } finally {
      setLoading(false)
    }
  }

  if (!id) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Review</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="text" className="block text-gray-700 font-semibold mb-2">
            Review Text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="rating" className="block text-gray-700 font-semibold mb-2">
            Rating: {rating} ⭐
          </label>
          <input
            type="range"
            id="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Review'}
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

