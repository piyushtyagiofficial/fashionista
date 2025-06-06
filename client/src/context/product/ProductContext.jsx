import { createContext, useState, useCallback } from 'react';
import api from '../../utils/api';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  // Separate loading and error states for each fetch
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState(null);

  const [newArrivalsLoading, setNewArrivalsLoading] = useState(false);
  const [newArrivalsError, setNewArrivalsError] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // Get featured products
   const getFeaturedProducts = useCallback(async () => {
    try {
      setFeaturedLoading(true);
      setFeaturedError(null);
      
      const response = await api.get('/products', {
        params: {
          isFeatured: true,
          pageSize: 8
        }
      });
      
      setFeaturedProducts(response.data.products || []);
      setFeaturedLoading(false);
    } catch (error) {
      setFeaturedLoading(false);
      setFeaturedError('Failed to fetch featured products');
      console.error('Error fetching featured products:', error);
    }
  }, []);


  // Get new arrivals
  const getNewArrivals = useCallback(async () => {
    try {
      setNewArrivalsLoading(true);
      setNewArrivalsError(null);
      
      const response = await api.get('/products', {
        params: {
          isNew: true,
          pageSize: 8
        }
      });
      
      setNewArrivals(response.data.products || []);
      setNewArrivalsLoading(false);
    } catch (error) {
      setNewArrivalsLoading(false);
      setNewArrivalsError('Failed to fetch new arrivals');
      console.error('Error fetching new arrivals:', error);
    }
  }, []);

  // Get all products with filtering and pagination
  const getProducts = async (filters = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/products', {
        params: {
          page,
          ...filters
        }
      });
      
      setProducts(response.data.products || []);
      setPagination({
        page: response.data.page || 1,
        pages: response.data.pages || 1,
        total: response.data.total || 0
      });
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  // Get product by ID
  const getProductById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError('Failed to fetch product details');
      console.error('Error fetching product:', error);
      throw error;
    }
  };

  // Create product review
  const createProductReview = async (productId, review) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(
        `/products/${productId}/reviews`,
        review
      );
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError('Failed to submit review');
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        featuredProducts,
        newArrivals,
        featuredLoading,
        featuredError,
        newArrivalsLoading,
        newArrivalsError,
        getFeaturedProducts,
        getNewArrivals,
        products,
        product,
        loading,
        error,
        pagination,
        getProducts,
        getProductById,
        createProductReview
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};