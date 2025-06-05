import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import { ProductList } from '../components/buyer/ProductList';
import { FaSearch, FaFilter } from 'react-icons/fa';

const ProductsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategory(params.get('category') || '');
    setSearchTerm(params.get('search') || '');
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (category) params.append('category', category);
    navigate(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (newCategory) params.append('category', newCategory);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">
            {user?.role === 'seller' ? 'My Products' : 'All Products'}
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md"
              />
            </div>

            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="accessories">Accessories</option>
            </select>

            <button
              onClick={handleSearch}
              className="btn btn-primary whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <ProductList />
    </div>
  );
};

export default ProductsPage;