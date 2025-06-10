import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import api from '../../utils/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    category: 'men',
    subcategory: '',
    description: '',
    price: '',
    salePrice: '',
    images: [],
    sizes: [],
    colors: [],
    featured: false
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to fetch product details');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate colors - ensure all colors have both name and color code
    const invalidColors = product.colors.filter(color => !color.color.trim() || !color.colorCode.trim());
    if (invalidColors.length > 0) {
      toast.error('Please provide both color name and color code for all colors');
      setLoading(false);
      return;
    }

    // Validate sizes - ensure all sizes have name and stock count
    const invalidSizes = product.sizes.filter(size => !size.size.trim() || size.countInStock === '');
    if (invalidSizes.length > 0) {
      toast.error('Please provide both size name and stock count for all sizes');
      setLoading(false);
      return;
    }

    try {
      const method = id ? 'put' : 'post';
      const url = id ? `/products/${id}` : '/products';

      // Ensure 'api' is called correctly with method, url, and data
      await api({
        method: method,
        url: url,
        data: product
      });

      toast.success(`Product ${id ? 'updated' : 'created'} successfully`);
      navigate('/seller/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${id ? 'update' : 'create'} product`);
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        return response.data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    setProduct(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', countInStock: '' }] // Changed from 0 to empty string
    }));
  };

  const removeSize = (index) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const addColor = () => {
    setProduct(prev => ({
      ...prev,
      colors: [...prev.colors, { color: '', colorCode: '#000000' }] // Set default color code
    }));
  };

  const removeColor = (index) => {
    setProduct(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;

  return (
    <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 min-h-screen py-12">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8 bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent font-serif">
          {id ? 'Edit Product' : 'Add New Product'}
        </h2>

        {/* The form starts here, wrapped with onSubmit={handleSubmit} */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={product.name}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-400 mb-2">Brand</label>
                <input
                  type="text"
                  id="brand"
                  value={product.brand}
                  onChange={(e) => setProduct(prev => ({ ...prev, brand: e.target.value }))}
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  id="category"
                  value={product.category}
                  onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  required
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-400 mb-2">Subcategory</label>
                <input
                  type="text"
                  id="subcategory"
                  value={product.subcategory}
                  onChange={(e) => setProduct(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              id="description"
              value={product.description}
              onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
              required
            />
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-2">Price</label>
                <input
                  type="number"
                  id="price"
                  value={product.price}
                  onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="salePrice" className="block text-sm font-medium text-gray-400 mb-2">Sale Price (Optional)</label>
                <input
                  type="number"
                  id="salePrice"
                  value={product.salePrice}
                  onChange={(e) => setProduct(prev => ({ ...prev, salePrice: parseFloat(e.target.value) }))}
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center justify-between">
              Images
              <span className="text-sm text-gray-500">PNG, JPG up to 5MB</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative rounded-md overflow-hidden">
                  <img
                    required
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md bg-gray-800">
              <div className="space-y-1 text-center">
                {uploadingImages ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-[#A6FFCB] hover:text-[#12D8FA] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#12D8FA] bg-gray-800 p-1">
                        <span>Upload images</span>
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImages}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Sizes</h3>
              <button
                type="button"
                onClick={addSize}
                className="text-[#A6FFCB] hover:text-[#12D8FA] transition-colors font-medium text-sm"
              >
                Add Size
              </button>
            </div>
            {product.sizes.map((size, index) => (
              <div key={index} className="flex gap-4 items-center mb-3">
                <input
                  type="text"
                  value={size.size}
                  onChange={(e) => {
                    const newSizes = [...product.sizes];
                    newSizes.find((_, i) => i === index).size = e.target.value;
                    setProduct(prev => ({ ...prev, sizes: newSizes }));
                  }}
                  placeholder="Size (e.g., S, M, L)"
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                />
                <input
                  type="number"
                  value={size.countInStock}
                  onChange={(e) => {
                    const newSizes = [...product.sizes];
                    newSizes.find((_, i) => i === index).countInStock = e.target.value === '' ? '' : parseInt(e.target.value);
                    setProduct(prev => ({ ...prev, sizes: newSizes }));
                  }}
                  placeholder="Stock"
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                  min="0"
                />
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Colors */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Colors</h3>
              <button
                type="button"
                onClick={addColor}
                className="text-[#A6FFCB] hover:text-[#12D8FA] transition-colors font-medium text-sm"
              >
                Add Color
              </button>
            </div>
            {product.colors.map((color, index) => (
              <div key={index} className="flex gap-4 items-center mb-3">
                <input
                  type="text"
                  value={color.color}
                  onChange={(e) => {
                    const newColors = [...product.colors];
                    newColors.find((_, i) => i === index).color = e.target.value;
                    setProduct(prev => ({ ...prev, colors: newColors }));
                  }}
                  placeholder="Color Name (e.g., Red, Blue)"
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-full sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white"
                />
                <input
                  type="color"
                  value={color.colorCode}
                  onChange={(e) => {
                    const newColors = [...product.colors];
                    newColors.find((_, i) => i === index).colorCode = e.target.value;
                    setProduct(prev => ({ ...prev, colors: newColors }));
                  }}
                  className="shadow-sm focus:ring-[#12D8FA] focus:border-[#12D8FA] block w-14 h-10 rounded-md border border-gray-700 cursor-pointer bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Featured Toggle */}
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <label htmlFor="featured" className="block text-sm font-medium text-gray-400">
                Featured Product
              </label>
              <input
                id="featured"
                type="checkbox"
                checked={product.featured}
                onChange={(e) => setProduct(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-5 w-5 text-[#A6FFCB] focus:ring-[#12D8FA] border-gray-700 rounded-md bg-gray-800 cursor-pointer shadow-sm"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="bg-gray-700 text-gray-100 px-6 py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-gray-900 px-6 py-3 rounded-md font-bold hover:from-[#A6FFCB] hover:to-[#1FA2FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1FA2FF] transition-all duration-300"
              disabled={loading || uploadingImages}
            >
              {loading ? 'Saving...' : (id ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;