import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthContext';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const WishlistPage = () => {
  const { getWishlist } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await getWishlist();
        setWishlistItems(response.wishlist);
      } catch (err) {
        setError('Failed to fetch wishlist');
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [getWishlist]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-gray-900 text-white">
        <div
          className="p-6 rounded-full mb-6 shadow-lg"
          style={{
            background: 'radial-gradient(circle at center, #3b82f6, #1e40af)',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.5)',
          }}
        >
          <FaHeart className="text-6xl" />
        </div>
        <h2 className="text-4xl font-extrabold mb-3 tracking-wide drop-shadow-md">
          Your wishlist is empty
        </h2>
        <p className="text-gray-300 max-w-lg text-center mb-10 text-lg">
          Start adding items to your wishlist by browsing our exciting collection of products.
        </p>
        <Link
          to="/products"
          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className=" mx-auto px-6 py-10 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <h1 className="text-4xl font-extrabold mb-10 tracking-wide text-gray-200 drop-shadow-lg">
        My Wishlist
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-gray-800 bg-opacity-30 p-6 rounded-xl shadow-inner">
        {wishlistItems.map((product) => (
          <div
            key={product._id}
            className="transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl rounded-lg"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;