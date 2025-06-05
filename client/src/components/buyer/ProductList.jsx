import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';
import api from '../../utils/api';

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

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

        const response = await api.get(`/products${params.toString() ? `?${params.toString()}` : ''}`);
        
        if (!response.data.products) {
          throw new Error('Invalid response format');
        }

        setProducts(response.data.products);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">No products found.</p>
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
