import { categoryApi } from '@/lib/api'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
  let category = null;
  let pokemons = [];
  let error = null;

  try {
    category = await categoryApi.getById(id);
    pokemons = await categoryApi.getPokemonByCategory(id);
  } catch (err: any) {
    if (err.response?.status === 404) {
      notFound();
    }
    error = 'Failed to load category details.';
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/categories"
        className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
      >
        ← Back to Categories
      </Link>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{category.name}</h1>
        <p className="text-gray-600">Category ID: {category.id}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pokemon in this Category</h2>

        {pokemons.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No pokemon in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemons.map((pokemon) => (
              <Link
                key={pokemon.id}
                href={`/pokemon/${pokemon.id}`}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {pokemon.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {pokemon.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Born: {new Date(pokemon.birthDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

