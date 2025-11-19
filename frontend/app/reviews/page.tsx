import Link from 'next/link'
import { reviewApi } from '@/lib/api'
import DeleteButton from '@/components/DeleteButton'

export default async function ReviewsPage() {
  let reviews = [];
  let error = null;

  try {
    reviews = await reviewApi.getAll();
  } catch (err) {
    error = 'Failed to load reviews. Make sure the backend API is running.';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">All Reviews</h1>
        <Link
          href="/reviews/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add Review
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {reviews.length === 0 && !error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg mb-4">No reviews found.</p>
          <Link
            href="/reviews/new"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Review
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex-1">
                  {review.title}
                </h3>
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                  {review.rating} ⭐
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{review.text}</p>
              <div className="flex gap-2">
                <Link
                  href={`/reviews/${review.id}/edit`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                >
                  Edit
                </Link>
                <span className="text-gray-300">|</span>
                <DeleteButton
                  id={review.id}
                  type="review"
                  redirectPath="/reviews"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

