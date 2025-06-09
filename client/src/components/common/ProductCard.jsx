import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useAuth } from "../../context/auth/AuthContext.jsx";
import { useCart } from "../../context/cart/CartContext.jsx";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { isAuthenticated, user, addToWishlist, removeFromWishlist } =
    useAuth();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(
    user?.wishlist?.includes(product._id)
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.length > 0 ? product.sizes[0].size : ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors.length > 0 ? product.colors[0].color : ""
  );
  const [isHovered, setIsHovered] = useState(false);

  // Check if current user is a buyer (only buyers can add to cart)
  const isBuyer = user?.role === 'buyer';
  const isSeller = user?.role === 'seller';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent sellers from adding to cart
    if (!isBuyer) {
      if (isSeller) {
        toast.error("Sellers cannot add products to cart. Switch to buyer account to purchase items.");
      } else {
        toast.error("Please login as a buyer to add items to cart");
      }
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    // Check stock for selected size
    const selectedSizeData = product.sizes.find((s) => s.size === selectedSize);
    if (!selectedSizeData || selectedSizeData.countInStock <= 0) {
      toast.error(
        `This item is out of stock in size ${selectedSize}. Try another size.`
      );
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
      seller: product.seller?._id || product.seller,
    };

    await addToCart(cartItem);
    toast.success("Added to cart successfully!");
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    // Only buyers can use wishlist
    if (!isBuyer) {
      if (isSeller) {
        toast.error("Sellers cannot use wishlist. Switch to buyer account to save items.");
      }
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist");
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      toast.error("Wishlist action failed");
      console.error("Wishlist action failed", error);
    }
  };

  const isOnSale = product.salePrice > 0 && product.salePrice < product.price;
  const discountPercentage = isOnSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Check if product has any stock
  const hasStock = product.sizes.some((size) => size.countInStock > 0);

  return (
    <motion.div
      className="product-card bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl overflow-hidden shadow-lg h-full border border-gray-700 hover:border-primary-main transition duration-300"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block h-full">
        <div className="relative overflow-hidden" style={{ height: "250px" }}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />

          {!hasStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Out of Stock
              </span>
            </div>
          )}

          {/* Only show wishlist button for authenticated buyers */}
          {isAuthenticated && isBuyer && (
            <button
              onClick={toggleWishlist}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-primary-main hover:text-white transition-colors z-10"
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
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-opacity-80 text-white text-xs font-bold py-1 px-2 rounded backdrop-blur-sm shadow">
                {discountPercentage}% OFF
              </span>
            )}
            {product.newArrival && (
              <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 bg-opacity-80 text-white text-xs font-bold py-1 px-2 rounded backdrop-blur-sm shadow">
                NEW
              </span>
            )}
          </div>

          {/* Only show add to cart overlay for buyers with stock available */}
          {isHovered && hasStock && isBuyer && (
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 transform transition-transform duration-300 space-y-2">
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
                          ? "border-primary-main bg-richblack-500 text-primary-dark"
                          : "border-neutral-950 text-neutral-700"
                      } ${
                        sizeOption.countInStock === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
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
                        selectedColor === colorOption.color
                          ? "ring-2 ring-primary-main"
                          : ""
                      }`}
                      style={{ backgroundColor: colorOption.colorCode }}
                      title={colorOption.color}
                    ></button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || !hasStock}
                className="bg-[#12D8FA] hover:bg-[#1FA2FF] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 w-full flex items-center justify-center gap-2 add-to-cart-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          )}

          {/* Show message for sellers when they hover */}
          {isHovered && isSeller && (
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-3 transform transition-transform duration-300">
              <p className="text-white text-sm text-center">
                Switch to buyer account to purchase items
              </p>
            </div>
          )}

          {/* Show login message for non-authenticated users */}
          {isHovered && !isAuthenticated && hasStock && (
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-3 transform transition-transform duration-300">
              <p className="text-white text-sm text-center">
                Login as buyer to add to cart
              </p>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center mb-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-500"
                  }
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-400">
              ({product.numReviews})
            </span>
          </div>

          <h3 className="font-serif text-lg font-extrabold bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent truncate">
            {product.name}
          </h3>

          <p className="text-gray-400 text-sm">{product.brand}</p>

          <div className="flex items-center gap-2">
            {isOnSale ? (
              <>
                <span className="font-bold text-error-main text-xl">
                  ₹{product.salePrice.toFixed(2)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-bold text-primary-main text-xl">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {!hasStock && (
            <p className="text-red-500 text-sm mt-1 font-medium">
              Out of Stock
            </p>
          )}

          {/* Show role-specific messages */}
          {isSeller && (
            <p className="text-yellow-500 text-xs mt-1 font-medium">
              Seller view - Switch to buyer account to purchase
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;