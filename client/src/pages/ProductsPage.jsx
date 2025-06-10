import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { ProductList } from "../components/buyer/ProductList";
import { FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../utils/api";

const ProductsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const isSellerProductsPage = location.pathname.includes('/seller/products');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategory(params.get("category") || "");
    setSearchTerm(params.get("search") || "");
    setPriceRange({
      min: params.get("minPrice") || "",
      max: params.get("maxPrice") || ""
    });
    setSortBy(params.get("sort") || "");
  }, [location.search]);

  useEffect(() => {
    if (isSellerProductsPage && user?.role === 'seller') {
      fetchSellerProducts();
    }
  }, [isSellerProductsPage, user]);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/seller/products');
      setSellerProducts(response.data);
    } catch (error) {
      console.error('Error fetching seller products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isSellerProductsPage) {
      applyFilters();
    }
  };

  const applyFilters = () => {
    if (!isSellerProductsPage) {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (category) params.append("category", category);
      if (priceRange.min) params.append("minPrice", priceRange.min);
      if (priceRange.max) params.append("maxPrice", priceRange.max);
      if (sortBy) params.append("sort", sortBy);
      navigate(`/products?${params.toString()}`);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (!isSellerProductsPage) {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (newCategory) params.append("category", newCategory);
      if (priceRange.min) params.append("minPrice", priceRange.min);
      if (priceRange.max) params.append("maxPrice", priceRange.max);
      if (sortBy) params.append("sort", sortBy);
      navigate(`/products?${params.toString()}`);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("");
    if (!isSellerProductsPage) {
      navigate('/products');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Product deleted successfully');
        fetchSellerProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredSellerProducts = isSellerProductsPage 
    ? sellerProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === '' || product.category === category;
        const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                           (!priceRange.max || product.price <= parseFloat(priceRange.max));
        return matchesSearch && matchesCategory && matchesPrice;
      })
    : [];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">
                  {isSellerProductsPage ? "My Products" : "All Products"}
                </h1>
                {isSellerProductsPage && (
                  <Link
                    to="/seller/products/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 px-4 py-2 rounded-lg font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] transition-all duration-300"
                  >
                    <FaPlus /> Add Product
                  </Link>
                )}
              </div>

              {!isSellerProductsPage && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaFilter /> Filters
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400"
                />
              </div>

              {!isSellerProductsPage && (
                <button
                  onClick={handleSearch}
                  className="bg-[#12D8FA] hover:bg-[#1FA2FF] text-white font-semibold px-6 py-2 rounded-md whitespace-nowrap"
                >
                  Search
                </button>
              )}
            </div>

            {/* Filters Panel */}
            {(showFilters || isSellerProductsPage) && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white"
                    >
                      <option value="">All Categories</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Min Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Max Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400"
                      min="0"
                    />
                  </div>

                  {/* Sort Filter */}
                  {!isSellerProductsPage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white"
                      >
                        <option value="">Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Filter Actions */}
                <div className="flex gap-4 mt-4">
                  {!isSellerProductsPage && (
                    <button
                      onClick={applyFilters}
                      className="bg-[#12D8FA] hover:bg-[#1FA2FF] text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Apply Filters
                    </button>
                  )}
                  <button
                    onClick={clearFilters}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    <FaTimes /> Clear All
                  </button>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || category || priceRange.min || priceRange.max || sortBy) && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchTerm && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                          Search: {searchTerm}
                        </span>
                      )}
                      {category && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                          Category: {category}
                        </span>
                      )}
                      {priceRange.min && (
                        <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                          Min: ₹{priceRange.min}
                        </span>
                      )}
                      {priceRange.max && (
                        <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                          Max: ₹{priceRange.max}
                        </span>
                      )}
                      {sortBy && (
                        <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs">
                          Sort: {sortBy}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isSellerProductsPage ? (
          <div className="bg-gray-800 rounded-lg shadow-sm p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : filteredSellerProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || category || priceRange.min || priceRange.max ? "No products match your search criteria." : "You haven't added any products yet."}
                </p>
                <Link
                  to="/seller/products/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 px-6 py-3 rounded-lg font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] transition-all duration-300"
                >
                  <FaPlus /> Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSellerProducts.map((product) => (
                  <div key={product._id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700">
                    <div className="relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Link
                          to={`/seller/products/${product._id}/edit`}
                          className="bg-blue-700 hover:bg-[#12D8FA] text-white p-2 rounded-full transition-colors"
                          title="Edit Product"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                          title="Delete Product"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 truncate">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-400 font-bold">
                          ₹{(product.salePrice || product.price).toFixed(2)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.featured ? 'bg-yellow-600/20 text-yellow-400' : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {product.featured ? 'Featured' : 'Regular'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Stock: {product.sizes.reduce((total, size) => total + size.countInStock, 0)} items
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ProductList />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;