import Link from 'next/link'
import { pokemonApi } from '@/lib/api'

export default async function Home() {
  let pokemons = [];
  let error = null;

  try {
    pokemons = await pokemonApi.getAll();
  } catch (err: any) {
    console.error('Error loading pokemons:', err);
    if (err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || err.code === 'CERT_HAS_EXPIRED' || err.message?.includes('certificate')) {
      error = 'SSL Certificate Error: The backend uses a self-signed certificate. See SSL_SETUP.md for instructions.';
    } else if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
      error = 'Connection Refused: Make sure the backend API is running on https://localhost:7177';
    } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
      error = 'Network Error: Cannot reach the backend API. Check if it\'s running and CORS is configured.';
    } else {
      error = `Failed to load pokemons: ${err.message || 'Unknown error'}. Make sure the backend API is running.`;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Pokemon Review
        </h1>
        <p className="text-xl text-gray-600">
          Explore and manage your favorite Pokemon reviews
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <div className="mt-3 text-sm">
            <p className="font-semibold mb-2">Troubleshooting steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Verify backend is running at <a href="https://localhost:7177/swagger/index.html" target="_blank" rel="noopener noreferrer" className="underline">https://localhost:7177/swagger/index.html</a></li>
              <li>Create <code className="bg-red-200 px-1 rounded">.env.local</code> in the frontend folder with: <code className="bg-red-200 px-1 rounded">NODE_TLS_REJECT_UNAUTHORIZED=0</code></li>
              <li>Restart the Next.js dev server</li>
              <li>See <code className="bg-red-200 px-1 rounded">TROUBLESHOOTING.md</code> for more help</li>
            </ol>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pokemons.map((pokemon) => (
          <Link
            key={pokemon.id}
            href={`/pokemon/${pokemon.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 transform hover:scale-105"
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
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
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No pokemons found. Create one to get started!</p>
          <Link
            href="/pokemon/new"
            className="mt-4 inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Pokemon
          </Link>
        </div>
      )}
    </div>
  )
}

