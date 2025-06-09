import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart/CartContext";
import { useAuth } from "../../context/auth/AuthContext";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import Loader from "../common/Loader";
import ProductReviews from "./ProductReviews";
import { toast } from "react-toastify";
import api from "../../utils/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  // Check if current user is a buyer
  const isBuyer = user?.role === 'buyer';
  const isSeller = user?.role === 'seller';

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const data = response.data;
      setProduct(data);
      setMainImage(data.images[0]);
      if (data.sizes.length > 0) {
        setSelectedSize(data.sizes[0].size);
      }
      if (data.colors.length > 0) {
        setSelectedColor(data.colors[0].color);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
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

    // Get stock info for selected size
    const selectedSizeData = product.sizes.find((s) => s.size === selectedSize);
    if (!selectedSizeData || selectedSizeData.countInStock < quantity) {
      toast.error(`Only ${Math.max(0, selectedSizeData.countInStock) || 0} items available in stock`);
      return;
    }

    if (!product.seller) {
      toast.error("Product information is incomplete");
      return;
    }

    await addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      images: product.images,
      size: selectedSize,
      color: selectedColor,
      qty: quantity,
      seller: product.seller._id || product.seller,
    });
    toast.success('Added to cart successfully!');
  };

  const handleReviewAdded = () => {
    // Refresh product data to get updated reviews
    fetchProduct();
  };

  if (loading) return <Loader />;
  if (!product)
    return <div className="text-center py-8 text-white">Product not found</div>;

  const selectedSizeData = product.sizes.find((s) => s.size === selectedSize);
  const maxQuantity = selectedSizeData?.countInStock || 0;

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto bg-gray-900 rounded-xl shadow-xl p-8 md:p-12 text-gray-200">
        {/* Show role-specific message for sellers */}
        {isSeller && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <p className="text-yellow-400 text-center font-medium">
              You are viewing this as a seller. Switch to a buyer account to purchase items.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-w-1 aspect-h-1 w-full rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden focus:outline-none transition ring-offset-2 ring-offset-black ${
                    mainImage === image
                      ? 'ring-4 ring-cyan-500'
                      : 'ring-transparent hover:ring-2 hover:ring-cyan-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-white">{product.name}</h1>
              <p className="text-xl text-cyan-400 font-semibold mt-1">{product.brand}</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex text-yellow-400 text-lg">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-700'
                    }
                  />
                ))}
              </div>
              <span className="text-gray-400 text-lg">
                ({product.numReviews} reviews)
              </span>
            </div>

            <div className="text-3xl font-extrabold text-white">
              ₹{(product.salePrice || product.price).toFixed(2)}
              {product.salePrice > 0 && (
                <span className="ml-3 text-xl line-through text-gray-500">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700">
              <h3 className="text-2xl font-semibold text-cyan-400">Description</h3>
              <p className="mt-3 text-gray-300">{product.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Select Size</h3>
              <div className="grid grid-cols-4 gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => setSelectedSize(size.size)}
                    disabled={size.countInStock === 0 || !isBuyer}
                    className={`py-3 px-6 rounded-lg font-semibold transition-colors duration-300 focus:outline-none ${
                      size.countInStock === 0 || !isBuyer
                        ? 'opacity-40 cursor-not-allowed bg-gray-700 text-gray-500'
                        : selectedSize === size.size
                        ? 'bg-[#12D8FA] text-white shadow-lg'
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    {size.size}
                    {size.countInStock === 0 && (
                      <span className="block text-xs">Out of Stock</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Select Color</h3>
              <div className="grid grid-cols-4 gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color.color}
                    onClick={() => setSelectedColor(color.color)}
                    disabled={!isBuyer}
                    title={color.color}
                    className={`w-full h-12 rounded-lg border-2 transition-shadow duration-300 focus:outline-none ${
                      !isBuyer
                        ? 'opacity-40 cursor-not-allowed'
                        : selectedColor === color.color
                        ? 'ring-4 ring-cyan-400 shadow-lg'
                        : 'ring-0 border-gray-700'
                    }`}
                    style={{ backgroundColor: color.colorCode }}
                  />
                ))}
              </div>
            </div>

            {isBuyer && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Quantity</h3>
                <div className="flex items-center space-x-5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-white"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => {
                      if (quantity < maxQuantity) {
                        setQuantity(quantity + 1);
                      } else {
                        toast.error(`Only ${maxQuantity} items available in stock`);
                      }
                    }}
                    className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-white"
                    disabled={quantity >= maxQuantity}
                  >
                    +
                  </button>
                </div>
                {selectedSizeData && (
                  <p className="text-sm text-gray-500 mt-2">
                    {Math.max(0, selectedSizeData.countInStock)} items available
                  </p>
                )}
              </div>
            )}

            {isBuyer ? (
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || maxQuantity === 0}
                className="w-full flex items-center justify-center space-x-4 bg-[#12D8FA] hover:bg-[#1FA2FF] text-white font-bold py-4 rounded-xl shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart size={22} />
                <span className="text-lg">
                  {maxQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </span>
              </button>
            ) : (
              <div className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-center">
                <p className="text-gray-400 mb-2">
                  {isSeller 
                    ? "Switch to buyer account to purchase items" 
                    : "Login as buyer to add items to cart"}
                </p>
                {!user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-[#12D8FA] hover:bg-[#1FA2FF] text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section - Only buyers can add reviews */}
        <ProductReviews
          productId={product._id}
          reviews={product.reviews}
          onReviewAdded={handleReviewAdded}
          canReview={isBuyer}
        />
      </div>
    </div>
  );
};

export default ProductDetail;