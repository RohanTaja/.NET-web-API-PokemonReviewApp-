'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pokemonApi, ownerApi, categoryApi } from '@/lib/api'
import { Pokemon, Owner, Category } from '@/types'

export default function EditPokemonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [owners, setOwners] = useState<Owner[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        const [pokemon, ownersData, categoriesData] = await Promise.all([
          pokemonApi.getById(id),
          ownerApi.getAll(),
          categoryApi.getAll(),
        ])
        setName(pokemon.name)
        setBirthDate(pokemon.birthDate.split('T')[0])
        setOwners(ownersData)
        setCategories(categoriesData)
        if (ownersData.length > 0) setOwnerId(ownersData[0].id.toString())
        if (categoriesData.length > 0) setCategoryId(categoriesData[0].id.toString())
      } catch (err) {
        setError('Failed to load pokemon data')
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    params.then(({ id: idParam }) => {
      setId(parseInt(idParam))
    })
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setLoading(true)
    setError('')

    try {
      await pokemonApi.update(
        id,
        {
          id,
          name,
          birthDate: new Date(birthDate).toISOString(),
        },
        parseInt(ownerId),
        parseInt(categoryId)
      )
      router.push(`/pokemon/${id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update pokemon')
    } finally {
      setLoading(false)
    }
  }

  if (!id) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Pokemon</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Name
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

        <div className="mb-6">
          <label htmlFor="birthDate" className="block text-gray-700 font-semibold mb-2">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="owner" className="block text-gray-700 font-semibold mb-2">
            Owner
          </label>
          <select
            id="owner"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          >
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.firstName} {owner.lastName} - {owner.gym}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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
            {loading ? 'Updating...' : 'Update Pokemon'}
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

