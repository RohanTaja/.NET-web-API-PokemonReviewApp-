import { pokemonApi, reviewApi } from '@/lib/api'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import { notFound } from 'next/navigation'

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
  let pokemon = null;
  let reviews = [];
  let rating = 0;
  let error = null;

  try {
    pokemon = await pokemonApi.getById(id);
    reviews = await reviewApi.getByPokemon(id);
    rating = await pokemonApi.getRating(id);
  } catch (err: any) {
    if (err.response?.status === 404) {
      notFound();
    }
    error = 'Failed to load pokemon details.';
  }

  if (!pokemon) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/pokemon"
        className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
      >
        ← Back to Pokemon
      </Link>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-5xl font-bold text-white">
            {pokemon.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {pokemon.name}
                </h1>
                <p className="text-gray-600">
                  Birth Date: {new Date(pokemon.birthDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/pokemon/${id}/edit`}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton
                  id={id}
                  type="pokemon"
                  redirectPath="/pokemon"
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
                <span className="font-semibold">Rating: </span>
                <span className="text-2xl">{rating.toFixed(1)}</span>
                <span className="text-sm">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
          <Link
            href={`/reviews/new?pokemonId=${id}`}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            + Add Review
          </Link>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No reviews yet. Be the first to review this Pokemon!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {review.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {review.rating} ⭐
                    </span>
                    <Link
                      href={`/reviews/${review.id}/edit`}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      id={review.id}
                      type="review"
                      redirectPath={`/pokemon/${id}`}
                    />
                  </div>
                </div>
                <p className="text-gray-600">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

