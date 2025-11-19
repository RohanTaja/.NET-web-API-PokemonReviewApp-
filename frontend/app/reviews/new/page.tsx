'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { reviewApi, reviewerApi, pokemonApi } from '@/lib/api'
import { Reviewer, Pokemon } from '@/types'

export default function NewReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pokemonIdParam = searchParams.get('pokemonId')

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewerId, setReviewerId] = useState('')
  const [pokemonId, setPokemonId] = useState(pokemonIdParam || '')
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewersData, pokemonsData] = await Promise.all([
          reviewerApi.getAll(),
          pokemonApi.getAll(),
        ])
        setReviewers(reviewersData)
        setPokemons(pokemonsData)
        if (reviewersData.length > 0) setReviewerId(reviewersData[0].id.toString())
        if (pokemonsData.length > 0 && !pokemonIdParam) {
          setPokemonId(pokemonsData[0].id.toString())
        }
      } catch (err) {
        setError('Failed to load reviewers or pokemons')
      }
    }
    fetchData()
  }, [pokemonIdParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await reviewApi.create(
        {
          title,
          text,
          rating,
        },
        parseInt(reviewerId),
        parseInt(pokemonId)
      )
      if (pokemonIdParam) {
        router.push(`/pokemon/${pokemonIdParam}`)
      } else {
        router.push('/reviews')
      }
      router.refresh()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Create New Review</h1>

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
            placeholder="Enter review title"
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
            placeholder="Write your review..."
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

        <div className="mb-6">
          <label htmlFor="reviewer" className="block text-gray-700 font-semibold mb-2">
            Reviewer
          </label>
          <select
            id="reviewer"
            value={reviewerId}
            onChange={(e) => setReviewerId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          >
            {reviewers.map((reviewer) => (
              <option key={reviewer.id} value={reviewer.id}>
                {reviewer.firstName} {reviewer.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="pokemon" className="block text-gray-700 font-semibold mb-2">
            Pokemon
          </label>
          <select
            id="pokemon"
            value={pokemonId}
            onChange={(e) => setPokemonId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          >
            {pokemons.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                {pokemon.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Review'}
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

