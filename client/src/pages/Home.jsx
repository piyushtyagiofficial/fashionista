import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { ProductContext } from "../context/product/ProductContext";
import ProductCard from "../components/common/ProductCard";
import Loader from "../components/common/Loader";

const Home = () => {
  const {
    featuredProducts,
    newArrivals,
    featuredLoading,
    featuredError,
    newArrivalsLoading,
    newArrivalsError,
    getFeaturedProducts,
    getNewArrivals,
  } = useContext(ProductContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getFeaturedProducts(), getNewArrivals()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getFeaturedProducts, getNewArrivals]);

  const heroSliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000, // 3 seconds per slide
    speed: 800, // slide transition speed
    cssEase: "ease-in-out",
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false, // keep auto sliding even on hover (optional)
    arrows: true, // Arrows are enabled in the second example
    dotsClass: "slick-dots custom-dots",
  };

  const productSliderSettings = {
    // This was not used in the original code, but kept for completeness
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const categories = [
    {
      id: "women",
      name: "Women",
      image:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Elegant & Trendy",
    },
    {
      id: "men",
      name: "Men",
      image:
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Classic & Modern",
    },
    {
      id: "kids",
      name: "Kids",
      image:
        "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Fun & Comfortable",
    },
    {
      id: "accessories",
      name: "Accessories",
      image:
        "https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Complete Your Look",
    },
  ];

  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      title: "Free Shipping",
      description: "On all orders over ₹999",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Secure Payment",
      description: "100% secure payment",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      title: "Easy Returns",
      description: "30 days return policy",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-primary-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      title: "24/7 Support",
      description: "Dedicated support",
    },
  ];

  const shadowColors = [
    "rgba(255, 99, 132, 0.6)", // pink/red
    "rgba(54, 162, 235, 0.6)", // blue
    "rgba(255, 206, 86, 0.6)", // yellow
    "rgba(75, 192, 192, 0.6)", // teal
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <Slider {...heroSliderSettings}>
          <div className="relative h-[80vh] min-h-[500px]">
            <img
              src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Summer Collection"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl text-center"
              >
                <h1 className="text-6xl md:text-7xl font-extrabold font-serif mb-6">
                  Summer Collection 2025
                </h1>
                <p className="text-xl mb-8 font-light gap-2 font-serif">
                  Discover the latest trends in summer fashion with our new
                  collection.
                </p>
                <Link
                  to="/products?category=summer"
                  className="inline-block bg-white text-black px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Shop Now
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="relative h-[80vh] min-h-[500px]">
            <img
              src="https://images.pexels.com/photos/845434/pexels-photo-845434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Premium Collection"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl text-center"
              >
                <h1 className="text-6xl md:text-7xl font-extrabold font-serif mb-6">
                  Premium Collection
                </h1>
                <p className="text-xl mb-8 font-light gap-2 font-serif">
                  Elevate your style with our premium quality clothing and
                  accessories.
                </p>
                <Link
                  to="/products?category=premium"
                  className="inline-block bg-white text-black px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Explore
                </Link>
              </motion.div>
            </div>
          </div>
        </Slider>
      </section>

      {/* Gradient background applied safely only below slider */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Motivational Quote */}
        <section className="py-12 text-center px-4">
          <h2 className="text-4xl font-bold mb-4 font-serif bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text font-bold">
            Style is a way to say who you are without having to speak
          </h2>
          <p className="text-lg font-light bg-gradient-to-br from-[#833AB4] via-[#af2424] to-[#FCB045] bg-clip-text text-transparent">
            ~ Rachel Zoe
          </p>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-center mb-4 font-serif text-white tracking-wide leading-tight">
              Shop by Category
            </h2>
            <p className="text-[#60a5fa] text-lg font-medium text-center mb-12 font-serif tracking-wide">
              Explore our diverse collection of fashion items for every style
              and occasion
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const color = shadowColors[index % shadowColors.length];
                return (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                  >
                    <motion.div
                      whileHover={{
                        y: -10,
                        boxShadow: `0 8px 16px -4px ${color}`, // bottom shadow with offset, blur, negative spread
                      }}
                      initial={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} // subtle default shadow
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="relative rounded-lg overflow-hidden h-64 cursor-pointer"
                      style={{
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        transition: "box-shadow 0.3s ease",
                      }}
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-end p-4 lg:p-6">
                        <h3 className="text-xl font-semibold text-white font-serif">
                          {category.name}
                        </h3>
                        <p className="text-white font-serif">
                          {category.description}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-gradient-to-b from-gray-950 to-black text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-center mb-4 font-serif text-white tracking-wide leading-tight">
              Featured Products
            </h2>
            <p className="text-[#60a5fa] text-lg font-medium text-center mb-12 font-serif tracking-wide">
              Handpicked items that showcase the best of our collection
            </p>

            {featuredLoading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : featuredError ? (
              <div className="text-center text-red-500 bg-red-100 p-4 rounded-md text-black">
                {featuredError}
              </div>
            ) : featuredProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No featured products available at the moment.</p>
                <Link
                  to="/products"
                  className="inline-block bg-white text-black px-6 py-3 rounded-md text-base font-medium hover:bg-gray-200 transition-colors mt-4"
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Banner Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 8px 24px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.2)",
              }}
              initial={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              transition={{ duration: 0.4 }}
              className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer"
            >
              {/* Background image — just scale on hover */}
              <img
                src="https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Special Offer"
                className="w-full h-80 object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
              />

              {/* Text same as before */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-lg p-8">
                  <h2 className="text-4xl font-bold text-white mb-4 font-serif">
                    Special Offer
                  </h2>
                  <p className="text-white text-lg mb-6 font-serif">
                    Get up to 50% off on selected items. Limited time offer!
                  </p>
                  <Link
                    to="/products?discount=true"
                    className="inline-block bg-white text-black px-8 py-4 rounded-md text-lg font-extrabold hover:bg-gray-200 transition-colors font-serif"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-center mb-4 font-serif text-white tracking-wide leading-tight">
              New Arrivals
            </h2>
             <p className="text-[#60a5fa] text-lg font-medium text-center mb-12 font-serif tracking-wide">
              Stay ahead of the trends with our latest fashion arrivals
            </p>
            {newArrivalsLoading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : newArrivalsError ? (
              <div className="text-center text-red-500 bg-red-100 p-4 rounded-md text-black">
                {newArrivalsError}
              </div>
            ) : newArrivals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newArrivals.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No new arrivals available at the moment.</p>
                <Link
                  to="/products"
                  className="inline-block bg-white text-black px-6 py-3 rounded-md text-base font-medium hover:bg-gray-200 transition-colors mt-4"
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-black text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-center mb-4 font-serif text-white tracking-wide leading-tight">
              Why Shop With Us
            </h2>
             <p className="text-[#60a5fa] text-lg font-medium text-center mb-12 font-serif tracking-wide">
              We're committed to providing you with the best shopping experiencee
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-gray-800/50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;