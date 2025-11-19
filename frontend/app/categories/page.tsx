import Link from 'next/link'
import { categoryApi } from '@/lib/api'
import DeleteButton from '@/components/DeleteButton'

export default async function CategoriesPage() {
  let categories = [];
  let error = null;

  try {
    categories = await categoryApi.getAll();
  } catch (err) {
    error = 'Failed to load categories. Make sure the backend API is running.';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">All Categories</h1>
        <Link
          href="/categories/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add Category
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {categories.length === 0 && !error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg mb-4">No categories found.</p>
          <Link
            href="/categories/new"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Category
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {category.name}
                </h3>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/categories/${category.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                >
                  View Pokemon
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href={`/categories/${category.id}/edit`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                >
                  Edit
                </Link>
                <span className="text-gray-300">|</span>
                <DeleteButton
                  id={category.id}
                  type="category"
                  redirectPath="/categories"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

