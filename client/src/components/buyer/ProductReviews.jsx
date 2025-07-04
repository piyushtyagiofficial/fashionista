import { useState, useEffect } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/auth/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ProductReviews = ({ productId, reviews, onReviewAdded, canReview = true }) => {
  const { isAuthenticated, user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Only buyers can review
  const isBuyer = user?.role === 'buyer';
  const canUserReview = canReview && isBuyer;

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!isBuyer) {
      toast.error('Only buyers can submit reviews');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/products/${productId}/reviews`, {
        rating,
        comment: comment.trim()
      });

      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      setShowReviewForm(false);

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`${
          i < rating ? 'text-yellow-400' : 'text-gray-700'
        } ${interactive ? 'cursor-pointer hover:text-yellow-300 transition-colors duration-200' : ''}`}
        onClick={interactive ? () => onStarClick(i + 1) : undefined}
      />
    ));
  };

  return (
    <div className="mt-12 bg-gray-900 rounded-xl shadow-xl p-8 text-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-extrabold text-white">Customer Reviews</h3>
        {canUserReview && isAuthenticated && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-[#12D8FA] hover:bg-[#1FA2FF] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            {showReviewForm ? 'Hide Review Form' : 'Write a Review'}
          </button>
        )}
        {!canUserReview && user?.role === 'seller' && (
          <p className="text-yellow-400 text-sm">
            Switch to buyer account to write reviews
          </p>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && canUserReview && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-inner border border-gray-700">
          <h4 className="text-xl font-semibold text-white mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-5">
              <label className="block text-lg font-medium text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex space-x-1 text-2xl">
                {renderStars(rating, true, setRating)}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-lg font-medium text-gray-300 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 placeholder-gray-400"
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#12D8FA] hover:bg-[#1FA2FF] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-700 pb-8 last:border-b-0">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-cyan-800 rounded-full flex items-center justify-center shadow-md">
                    <FaUser className="text-cyan-200 text-2xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h5 className="font-semibold text-white text-lg">{review.name}</h5>
                    <div className="flex space-x-1 text-xl">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3 leading-relaxed">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 text-lg">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;