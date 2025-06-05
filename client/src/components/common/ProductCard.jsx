import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useAuth } from '../../context/auth/AuthContext.jsx';
import { useCart } from '../../context/cart/CartContext.jsx';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { isAuthenticated, user, addToWishlist, removeFromWishlist } = useAuth();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(
    user?.wishlist?.includes(product._id)
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.length > 0 ? product.sizes[0].size : ''
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors.length > 0 ? product.colors[0].color : ''
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      images: product.images,
      size: selectedSize,
      color: selectedColor,
      qty: 1,
      seller: product.seller?._id || product.seller
    };

    addToCart(cartItem);
    toast.success('Added to cart successfully!');
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      toast.error('Wishlist action failed');
      console.error('Wishlist action failed', error);
    }
  };

  const isOnSale = product.salePrice > 0 && product.salePrice < product.price;
  const discountPercentage = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      className="product-card bg-white rounded-lg overflow-hidden shadow-md h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block h-full">
        <div className="relative overflow-hidden" style={{ height: '250px' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          
          {isAuthenticated && user.role === 'buyer' && (
            <button
              onClick={toggleWishlist}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-neutral-100 transition-colors z-10"
            >
              {isWishlisted ? (
                <FaHeart className="text-error-main" />
              ) : (
                <FaRegHeart className="text-neutral-600" />
              )}
            </button>
          )}
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOnSale && (
              <span className="bg-error-main text-white text-xs font-bold py-1 px-2 rounded">
                {discountPercentage}% OFF
              </span>
            )}
            {product.newArrival && (
              <span className="bg-primary-main text-white text-xs font-bold py-1 px-2 rounded">
                NEW
              </span>
            )}
          </div>

          {isHovered && (
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 transform transition-transform duration-300">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-1">
                  {product.sizes.slice(0, 4).map((sizeOption) => (
                    <button
                      key={sizeOption.size}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSize(sizeOption.size);
                      }}
                      className={`w-8 h-8 text-xs border rounded-full flex items-center justify-center ${
                        selectedSize === sizeOption.size
                          ? 'border-primary-main bg-primary-light/10 text-primary-dark'
                          : 'border-neutral-300 text-neutral-600'
                      } ${sizeOption.countInStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={sizeOption.countInStock === 0}
                    >
                      {sizeOption.size}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((colorOption) => (
                    <button
                      key={colorOption.color}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedColor(colorOption.color);
                      }}
                      className={`w-6 h-6 rounded-full border ${
                        selectedColor === colorOption.color ? 'ring-2 ring-primary-main' : ''
                      }`}
                      style={{ backgroundColor: colorOption.colorCode }}
                      title={colorOption.color}
                    ></button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2 add-to-cart-btn"
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-1">
            <div className="flex text-secondary-dark">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(product.rating) ? 'text-secondary-main' : 'text-neutral-300'}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-neutral-500">
              ({product.numReviews})
            </span>
          </div>
          
          <h3 className="font-medium text-primary-dark mb-1 truncate">
            {product.name}
          </h3>
          
          <p className="text-neutral-600 text-sm mb-1">{product.brand}</p>
          
          <div className="flex items-center gap-2">
            {isOnSale ? (
              <>
                <span className="font-bold text-error-main">₹{product.salePrice.toFixed(2)}</span>
                <span className="text-neutral-500 line-through text-sm">₹{product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold text-primary-dark">₹{product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;