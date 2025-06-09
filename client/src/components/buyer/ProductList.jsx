import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';
import api from '../../utils/api';

export const ProductList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const category = searchParams.get('category');
        const search = searchParams.get('search');
        
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('keyword', search);

        // Determine the endpoint based on user role and current route
        let endpoint = '/products';
        
        // If we're on seller products page, fetch only seller's products
        if (location.pathname.includes('/seller/products') && user?.role === 'seller') {
          endpoint = '/products/seller/products';
        } else {
          // For public product listing, use the regular products endpoint
          endpoint = `/products${params.toString() ? `?${params.toString()}` : ''}`;
        }

        const response = await api.get(endpoint);
        
        // Handle different response structures
        let productsData = [];
        if (response.data.products) {
          // Standard paginated response
          productsData = response.data.products;
        } else if (Array.isArray(response.data)) {
          // Direct array response (like from seller products endpoint)
          productsData = response.data;
        } else {
          throw new Error('Invalid response format');
        }

        setProducts(productsData);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, location.pathname, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No products found</h3>
        <p className="text-gray-500 mb-4">
          {location.pathname.includes('/seller/products') 
            ? "You haven't added any products yet." 
            : "Try adjusting your search criteria."}
        </p>
        {location.pathname.includes('/seller/products') && (
          <button
            onClick={() => window.location.href = '/seller/products/new'}
            className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 px-6 py-3 rounded-lg font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] transition-all duration-300"
          >
            Add Your First Product
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;