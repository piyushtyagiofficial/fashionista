import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/cart/CartContext';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const data = response.data;
        setProduct(data);
        console.log(response);
        setMainImage(data.images[0]);
        if (data.sizes.length > 0) {
          setSelectedSize(data.sizes[0].size);
        }
        if (data.colors.length > 0) {
          setSelectedColor(data.colors[0].color);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    if (!product.seller) {
      toast.error('Product information is incomplete');
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      images: product.images,
      size: selectedSize,
      color: selectedColor,
      qty: quantity,
      seller: product.seller._id || product.seller
    });
    
    toast.success('Added to cart successfully!');
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`aspect-w-1 aspect-h-1 ${
                  mainImage === image ? 'ring-2 ring-primary-main' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-500">{product.brand}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-500">({product.numReviews} reviews)</span>
          </div>

          <div className="text-2xl font-bold text-gray-900">
            ${(product.salePrice || product.price).toFixed(2)}
            {product.salePrice > 0 && (
              <span className="ml-2 text-lg line-through text-gray-500">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-500">{product.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Select Size</h3>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size.size)}
                  className={`py-2 px-4 rounded-md ${
                    selectedSize === size.size
                      ? 'bg-primary-700 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } ${size.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={size.countInStock === 0}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Select Color</h3>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color.color}
                  onClick={() => setSelectedColor(color.color)}
                  className={`w-full h-10 rounded-md border-2 ${
                    selectedColor === color.color ? 'border-primary-main' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.colorCode }}
                  title={color.color}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Quantity</h3>
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColor}
            className="w-full flex items-center justify-center space-x-2 bg-primary-700 text-white py-3 px-6 rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;