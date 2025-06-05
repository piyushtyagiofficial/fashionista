import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { ProductContext } from '../context/product/ProductContext';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

const Home = () => {
  const {
    featuredProducts,
    newArrivals,
    featuredLoading,
    featuredError,
    newArrivalsLoading,
    newArrivalsError,
    getFeaturedProducts,
    getNewArrivals
  } = useContext(ProductContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getFeaturedProducts(), getNewArrivals()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [getFeaturedProducts, getNewArrivals]);

  const heroSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true
  };

  const productSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const categories = [
    {
      id: 'women',
      name: 'Women',
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'men',
      name: 'Men',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'kids',
      name: 'Kids',
      image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      image: 'https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <Slider {...heroSliderSettings}>
          <div className="relative h-[80vh] min-h-[500px]">
            <img
              src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Summer Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-xl text-white"
                >
                  <h1 className="text-5xl md:text-6xl font-bold mb-6">Summer Collection 2025</h1>
                  <p className="text-xl mb-8">Discover the latest trends in summer fashion with our new collection.</p>
                  <Link to="/products?category=summer" className="inline-block bg-white text-gray-900 px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors">
                    Shop Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="relative h-[80vh] min-h-[500px]">
            <img
              src="https://images.pexels.com/photos/845434/pexels-photo-845434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Premium Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-xl text-white"
                >
                  <h1 className="text-5xl md:text-6xl font-bold mb-6">Premium Collection</h1>
                  <p className="text-xl mb-8">Elevate your style with our premium quality clothing and accessories.</p>
                  <Link to="/products?category=premium" className="inline-block bg-white text-gray-900 px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors">
                    Explore
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </Slider>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/products?category=${category.id}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="relative rounded-lg overflow-hidden shadow-lg h-64"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-6">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          {featuredLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : featuredError ? (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
              {featuredError}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Special Offer"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="max-w-lg p-8">
                <h2 className="text-4xl font-bold text-white mb-4">Special Offer</h2>
                <p className="text-white text-lg mb-6">
                  Get up to 50% off on selected items. Limited time offer!
                </p>
                <Link to="/products?discount=true" className="inline-block bg-white text-gray-900 px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">New Arrivals</h2>
          {newArrivalsLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : newArrivalsError ? (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
              {newArrivalsError}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newArrivals.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On all orders over $50</p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment</p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30 days return policy</p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Dedicated support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;