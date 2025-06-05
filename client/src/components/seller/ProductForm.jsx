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

    try {
      const method = id ? 'put' : 'post';
      const url = id ? `/products/${id}` : '/products';
      
      await api[method](url, product);
      
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
      sizes: [...prev.sizes, { size: '', countInStock: 0 }]
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
      colors: [...prev.colors, { color: '', colorCode: '' }]
    }));
  };

  const removeColor = (index) => {
    setProduct(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {id ? 'Edit Product' : 'Add New Product'}
      </h2>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              value={product.brand}
              onChange={(e) => setProduct(prev => ({ ...prev, brand: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={product.category}
              onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <input
              type="text"
              value={product.subcategory}
              onChange={(e) => setProduct(prev => ({ ...prev, subcategory: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sale Price</label>
            <input
              type="number"
              value={product.salePrice}
              onChange={(e) => setProduct(prev => ({ ...prev, salePrice: parseFloat(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {product.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {uploadingImages ? (
                <Loader size="sm" />
              ) : (
                <>
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
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
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Sizes</label>
            <button
              type="button"
              onClick={addSize}
              className="text-primary-600 hover:text-primary-500"
            >
              Add Size
            </button>
          </div>
          {product.sizes.map((size, index) => (
            <div key={index} className="flex gap-4 items-center mb-2">
              <input
                type="text"
                value={size.size}
                onChange={(e) => {
                  const newSizes = [...product.sizes];
                  newSizes[index].size = e.target.value;
                  setProduct(prev => ({ ...prev, sizes: newSizes }));
                }}
                placeholder="Size"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <input
                type="number"
                value={size.countInStock}
                onChange={(e) => {
                  const newSizes = [...product.sizes];
                  newSizes[index].countInStock = parseInt(e.target.value);
                  setProduct(prev => ({ ...prev, sizes: newSizes }));
                }}
                placeholder="Stock"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min="0"
              />
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        {/* Colors */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Colors</label>
            <button
              type="button"
              onClick={addColor}
              className="text-primary-600 hover:text-primary-500"
            >
              Add Color
            </button>
          </div>
          {product.colors.map((color, index) => (
            <div key={index} className="flex gap-4 items-center mb-2">
              <input
                type="text"
                value={color.color}
                onChange={(e) => {
                  const newColors = [...product.colors];
                  newColors[index].color = e.target.value;
                  setProduct(prev => ({ ...prev, colors: newColors }));
                }}
                placeholder="Color Name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <input
                type="color"
                value={color.colorCode}
                onChange={(e) => {
                  const newColors = [...product.colors];
                  newColors[index].colorCode = e.target.value;
                  setProduct(prev => ({ ...prev, colors: newColors }));
                }}
                className="mt-1 block w-14 h-10"
              />
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={product.featured}
            onChange={(e) => setProduct(prev => ({ ...prev, featured: e.target.checked }))}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Featured Product
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/seller/dashboard')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading || uploadingImages}
          >
            {loading ? 'Saving...' : (id ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;