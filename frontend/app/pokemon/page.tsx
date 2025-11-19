import Link from 'next/link'
import { pokemonApi } from '@/lib/api'

export default async function PokemonPage() {
  let pokemons = [];
  let error = null;

  try {
    pokemons = await pokemonApi.getAll();
  } catch (err) {
    error = 'Failed to load pokemons. Make sure the backend API is running.';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">All Pokemon</h1>
        <Link
          href="/pokemon/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add Pokemon
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemons.map((pokemon) => (
          <Link
            key={pokemon.id}
            href={`/pokemon/${pokemon.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                {pokemon.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {pokemon.name}
              </h3>
              <p className="text-sm text-gray-500">
                Born: {new Date(pokemon.birthDate).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {pokemons.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg mb-4">No pokemons found.</p>
          <Link
            href="/pokemon/new"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Pokemon
          </Link>
        </div>
      )}
    </div>
  )
}

