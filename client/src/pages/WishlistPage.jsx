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

  console.log('WishlistPage rendered');
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
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-primary-100 mb-4">
            <FaHeart className="text-4xl text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Start adding items to your wishlist by browsing our products
          </p>
          <Link
            to="/products"
            className="btn btn-primary inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;