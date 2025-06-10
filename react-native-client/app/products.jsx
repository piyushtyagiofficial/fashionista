// // import React, { useState, useEffect, useRef } from 'react'; // Add useEffect and useRef
// // import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ToastAndroid, FlatList, Animated } from 'react-native'; // Add Animated
// // import Slider from '@react-native-community/slider';
// // import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// // import { useAuth } from '../AuthContext';
// // import { useNavigation } from 'expo-router';
// // import LottieView from 'lottie-react-native';
// // import { LinearGradient } from 'expo-linear-gradient';

// // export default function FashionShopScreen() {
// //   const { cartProducts, setCartProducts } = useAuth();
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showFilters, setShowFilters] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const productsPerPage = 6;
// //   const [filters, setFilters] = useState({
// //     category: null,
// //     subcategory: null,
// //     brand: null,
// //     minPrice: 0,
// //     maxPrice: 1000,
// //     rating: null,
// //     featured: false,
// //     newArrival: false,
// //   });

// //   const filterAnimation = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     Animated.timing(filterAnimation, {
// //       toValue: showFilters ? 1 : 0,
// //       duration: 300,
// //       useNativeDriver: true,
// //     }).start();
// //   }, [showFilters]);

// //   const filterOpacity = filterAnimation.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, 1],
// //   });

// //   const filterTranslateY = filterAnimation.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [-20, 0],
// //   });

// //   setTimeout(() => {
// //     setIsLoading(false);
// //   }, 2000);

// //   const navigation = useNavigation();

// //   const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Puma', 'Levi\'s'];
// //   const categories = ['men', 'women', 'kids', 'accessories'];
// //   const subcategories = {
// //     men: ['T-Shirts', 'Jeans', 'Shirts', 'Jackets', 'Shoes'],
// //     women: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Shoes'],
// //     kids: ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Shoes'],
// //     accessories: ['Watches', 'Bags', 'Jewelry', 'Hats', 'Sunglasses'],
// //   };
// //   const ratings = [1, 2, 3, 4, 5];

// //   const products = [
// //     {
// //       _id: "1",
// //       seller: "seller1",
// //       name: 'Premium Leather Jacket',
// //       images: ['https://img.freepik.com/free-photo/black-leather-jacket-white-background_53876-102725.jpg'],
// //       brand: 'Zara',
// //       category: 'men',
// //       subcategory: 'Jackets',
// //       description: 'High-quality genuine leather jacket with premium stitching',
// //       rating: 4.5,
// //       numReviews: 24,
// //       price: 250,
// //       salePrice: 199.99,
// //       sizes: [
// //         { size: 'S', countInStock: 5 },
// //         { size: 'M', countInStock: 8 },
// //         { size: 'L', countInStock: 3 },
// //       ],
// //       colors: [
// //         { color: 'Black', colorCode: '#000000' },
// //         { color: 'Brown', colorCode: '#964B00' },
// //       ],
// //       featured: true,
// //       newArrival: false,
// //     },
// //     {
// //       _id: "2",
// //       seller: "seller2",
// //       name: 'Classic White Sneakers',
// //       images: ['https://img.freepik.com/free-photo/pair-white-sneakers_53876-96041.jpg'],
// //       brand: 'Adidas',
// //       category: 'men',
// //       subcategory: 'Shoes',
// //       description: 'Comfortable white sneakers for everyday wear',
// //       rating: 4.8,
// //       numReviews: 56,
// //       price: 120,
// //       salePrice: 89.99,
// //       sizes: [
// //         { size: '8', countInStock: 10 },
// //         { size: '9', countInStock: 7 },
// //         { size: '10', countInStock: 4 },
// //       ],
// //       colors: [
// //         { color: 'White', colorCode: '#FFFFFF' },
// //       ],
// //       featured: false,
// //       newArrival: true,
// //     },
// //     {
// //       _id: "3",
// //       seller: "seller3",
// //       name: 'Summer Floral Dress',
// //       images: ['https://img.freepik.com/free-photo/red-dress-woman_1203-7534.jpg'],
// //       brand: 'H&M',
// //       category: 'women',
// //       subcategory: 'Dresses',
// //       description: 'Lightweight floral dress perfect for summer',
// //       rating: 4.2,
// //       numReviews: 18,
// //       price: 65,
// //       salePrice: 45.99,
// //       sizes: [
// //         { size: 'XS', countInStock: 3 },
// //         { size: 'S', countInStock: 6 },
// //         { size: 'M', countInStock: 4 },
// //       ],
// //       colors: [
// //         { color: 'Red', colorCode: '#FF0000' },
// //         { color: 'Blue', colorCode: '#0000FF' },
// //       ],
// //       featured: true,
// //       newArrival: true,
// //     },
// //     {
// //       _id: "4",
// //       seller: "seller4",
// //       name: 'Kids Hoodie',
// //       images: ['https://img.freepik.com/free-photo/kids-wear_1203-8395.jpg'],
// //       brand: 'Puma',
// //       category: 'kids',
// //       subcategory: 'T-Shirts',
// //       description: 'Comfortable hoodie for kids with fun designs',
// //       rating: 4.7,
// //       numReviews: 12,
// //       price: 45,
// //       salePrice: 32.99,
// //       sizes: [
// //         { size: '4-5', countInStock: 8 },
// //         { size: '6-7', countInStock: 5 },
// //         { size: '8-9', countInStock: 3 },
// //       ],
// //       colors: [
// //         { color: 'Blue', colorCode: '#0000FF' },
// //         { color: 'Pink', colorCode: '#FFC0CB' },
// //       ],
// //       featured: false,
// //       newArrival: false,
// //     },
// //     {
// //       _id: "5",
// //       seller: "seller5",
// //       name: 'Luxury Watch',
// //       images: ['https://img.freepik.com/free-photo/watch_1203-8150.jpg'],
// //       brand: 'Gucci',
// //       category: 'accessories',
// //       subcategory: 'Watches',
// //       description: 'Elegant luxury watch with premium materials',
// //       rating: 4.9,
// //       numReviews: 42,
// //       price: 200,
// //       salePrice: 159.99,
// //       sizes: [
// //         { size: 'One Size', countInStock: 15 },
// //       ],
// //       colors: [
// //         { color: 'Gold', colorCode: '#FFD700' },
// //         { color: 'Silver', colorCode: '#C0C0C0' },
// //       ],
// //       featured: true,
// //       newArrival: false,
// //     },
// //     {
// //       _id: "6",
// //       seller: "seller6",
// //       name: 'Designer Handbag',
// //       images: ['https://img.freepik.com/free-photo/handbag_1203-8688.jpg'],
// //       brand: 'Gucci',
// //       category: 'accessories',
// //       subcategory: 'Bags',
// //       description: 'Stylish designer handbag with multiple compartments',
// //       rating: 4.6,
// //       numReviews: 31,
// //       price: 450,
// //       salePrice: 299.99,
// //       sizes: [
// //         { size: 'One Size', countInStock: 7 },
// //       ],
// //       colors: [
// //         { color: 'Black', colorCode: '#000000' },
// //         { color: 'Brown', colorCode: '#964B00' },
// //       ],
// //       featured: true,
// //       newArrival: true,
// //     },
// //     {
// //       _id: "7",
// //       seller: "seller7",
// //       name: 'Slim Fit Jeans',
// //       images: ['https://img.freepik.com/free-photo/blue-jeans-isolated_1203-7654.jpg'],
// //       brand: 'Levi\'s',
// //       category: 'men',
// //       subcategory: 'Jeans',
// //       description: 'Classic slim fit jeans with a modern stretch fabric',
// //       rating: 4.4,
// //       numReviews: 35,
// //       price: 80,
// //       salePrice: 59.99,
// //       sizes: [
// //         { size: '30', countInStock: 6 },
// //         { size: '32', countInStock: 9 },
// //         { size: '34', countInStock: 4 },
// //       ],
// //       colors: [
// //         { color: 'Dark Blue', colorCode: '#1C2526' },
// //         { color: 'Black', colorCode: '#000000' },
// //       ],
// //       featured: false,
// //       newArrival: true,
// //     },
// //     {
// //       _id: "8",
// //       seller: "seller8",
// //       name: 'Casual Blouse',
// //       images: ['https://img.freepik.com/free-photo/white-blouse-isolated_1203-7655.jpg'],
// //       brand: 'Zara',
// //       category: 'women',
// //       subcategory: 'Tops',
// //       description: 'Elegant casual blouse perfect for office or outings',
// //       rating: 4.3,
// //       numReviews: 28,
// //       price: 55,
// //       salePrice: 39.99,
// //       sizes: [
// //         { size: 'S', countInStock: 5 },
// //         { size: 'M', countInStock: 7 },
// //         { size: 'L', countInStock: 3 },
// //       ],
// //       colors: [
// //         { color: 'White', colorCode: '#FFFFFF' },
// //         { color: 'Beige', colorCode: '#F5F5DC' },
// //       ],
// //       featured: true,
// //       newArrival: false,
// //     },
// //     {
// //       _id: "9",
// //       seller: "seller9",
// //       name: 'Kids Sneakers',
// //       images: ['https://img.freepik.com/free-photo/kids-sneakers_1203-7656.jpg'],
// //       brand: 'Nike',
// //       category: 'kids',
// //       subcategory: 'Shoes',
// //       description: 'Lightweight sneakers for kids with a fun design',
// //       rating: 4.6,
// //       numReviews: 15,
// //       price: 60,
// //       salePrice: 49.99,
// //       sizes: [
// //         { size: '10K', countInStock: 6 },
// //         { size: '11K', countInStock: 5 },
// //         { size: '12K', countInStock: 4 },
// //       ],
// //       colors: [
// //         { color: 'Red', colorCode: '#FF0000' },
// //         { color: 'Green', colorCode: '#008000' },
// //       ],
// //       featured: false,
// //       newArrival: true,
// //     },
// //     {
// //       _id: "10",
// //       seller: "seller10",
// //       name: 'Sunglasses',
// //       images: ['https://img.freepik.com/free-photo/sunglasses_1203-7657.jpg'],
// //       brand: 'Ray-Ban',
// //       category: 'accessories',
// //       subcategory: 'Sunglasses',
// //       description: 'Stylish sunglasses with UV protection',
// //       rating: 4.8,
// //       numReviews: 50,
// //       price: 150,
// //       salePrice: 129.99,
// //       sizes: [
// //         { size: 'One Size', countInStock: 20 },
// //       ],
// //       colors: [
// //         { color: 'Black', colorCode: '#000000' },
// //         { color: 'Tortoise', colorCode: '#8B5A2B' },
// //       ],
// //       featured: true,
// //       newArrival: false,
// //     },
// //     {
// //       _id: "11",
// //       seller: "seller11",
// //       name: 'Running Shoes',
// //       images: ['https://img.freepik.com/free-photo/running-shoes_1203-7658.jpg'],
// //       brand: 'Puma',
// //       category: 'men',
// //       subcategory: 'Shoes',
// //       description: 'High-performance running shoes with cushioned soles',
// //       rating: 4.7,
// //       numReviews: 40,
// //       price: 110,
// //       salePrice: 89.99,
// //       sizes: [
// //         { size: '8', countInStock: 8 },
// //         { size: '9', countInStock: 6 },
// //         { size: '10', countInStock: 5 },
// //       ],
// //       colors: [
// //         { color: 'Black', colorCode: '#000000' },
// //         { color: 'Grey', colorCode: '#808080' },
// //       ],
// //       featured: false,
// //       newArrival: true,
// //     },
// //     {
// //       _id: "12",
// //       seller: "seller12",
// //       name: 'Evening Gown',
// //       images: ['https://img.freepik.com/free-photo/evening-gown_1203-7659.jpg'],
// //       brand: 'Gucci',
// //       category: 'women',
// //       subcategory: 'Dresses',
// //       description: 'Elegant evening gown with intricate detailing',
// //       rating: 4.9,
// //       numReviews: 22,
// //       price: 600,
// //       salePrice: 499.99,
// //       sizes: [
// //         { size: 'S', countInStock: 3 },
// //         { size: 'M', countInStock: 4 },
// //         { size: 'L', countInStock: 2 },
// //       ],
// //       colors: [
// //         { color: 'Emerald', colorCode: '#50C878' },
// //         { color: 'Navy', colorCode: '#000080' },
// //       ],
// //       featured: true,
// //       newArrival: true,
// //     },
// //   ];

// //   const filteredProducts = products.filter(product => {
// //     return (
// //       (!filters.category || product.category === filters.category) &&
// //       (!filters.subcategory || product.subcategory === filters.subcategory) &&
// //       (!filters.brand || product.brand === filters.brand) &&
// //       (product.price >= filters.minPrice && product.price <= filters.maxPrice) &&
// //       (!filters.rating || product.rating >= filters.rating) &&
// //       (!filters.featured || product.featured === true) &&
// //       (!filters.newArrival || product.newArrival === true)
// //     );
// //   });

// //   // Pagination logic
// //   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
// //   const startIndex = (currentPage - 1) * productsPerPage;
// //   const endIndex = startIndex + productsPerPage;
// //   const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

// //   const handleAddToCart = (product) => {
// //     const cartItemId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
// //     const existingProductIndex = cartProducts.findIndex(
// //       (item) =>
// //         item._id === product._id &&
// //         item.selectedSize === product.sizes[0].size &&
// //         item.selectedColor === product.colors[0].color
// //     );
// //     if (existingProductIndex === -1) {
// //       setCartProducts((prev) => [
// //         ...prev,
// //         {
// //           ...product,
// //           quantity: 1,
// //           selectedSize: product.sizes[0].size,
// //           selectedColor: product.colors[0].color,
// //           cartItemId,
// //           image: product.images[0],
// //         },
// //       ]);
// //     } else {
// //       const updatedCart = [...cartProducts];
// //       updatedCart[existingProductIndex].quantity += 1;
// //       setCartProducts(updatedCart);
// //     }
// //     ToastAndroid.show('Added to cart successfully!', ToastAndroid.SHORT);
// //   };

// //   const calculateDiscountPercentage = (price, salePrice) => {
// //     return Math.round(((price - salePrice) / price) * 100) + '%';
// //   };

// //   const resetFilters = () => {
// //     setFilters({
// //       category: null,
// //       subcategory: null,
// //       brand: null,
// //       minPrice: 0,
// //       maxPrice: 1000,
// //       rating: null,
// //       featured: false,
// //       newArrival: false,
// //     });
// //     setCurrentPage(1); // Reset to first page when filters are reset
// //   };

// //   const promotionalBanners = [
// //     { id: '1', title: 'Summer Sale Up to 50% Off!', color: '#FF6B81', image: 'https://img.freepik.com/free-photo/summer-sale_53876-138860.jpg' },
// //     { id: '2', title: 'New Arrivals in Accessories!', color: '#03DAC6', image: 'https://img.freepik.com/free-photo/accessories_53876-138861.jpg' },
// //     { id: '3', title: 'Free Shipping on Orders Over $200!', color: '#FFD700', image: 'https://img.freepik.com/free-photo/free-shipping_53876-138862.jpg' },
// //   ];

// //   const categoryIcons = {
// //     men: '👕',
// //     women: '👗',
// //     kids: '👶',
// //     accessories: '👜',
// //   };

// //   // Pagination navigation handlers
// //   const goToPreviousPage = () => {
// //     if (currentPage > 1) {
// //       setCurrentPage(currentPage - 1);
// //     }
// //   };

// //   const goToNextPage = () => {
// //     if (currentPage < totalPages) {
// //       setCurrentPage(currentPage + 1);
// //     }
// //   };

// //   const goToPage = (page) => {
// //     setCurrentPage(page);
// //   };

// //   if (isLoading) {
// //     return (
// //       <LinearGradient
// //         colors={["#121212", "#1E1E1E", "#252525"]}
// //         style={[styles.container, styles.loadingContainer]}
// //       >
// //         <LottieView
// //           source={{ uri: 'https://lottie.host/cd4d1dff-256b-461b-8b32-0cd291ff2e26/UZnRwRqeiq.lottie' }}
// //           autoPlay
// //           loop
// //           style={styles.lottie}
// //         />
// //       </LinearGradient>
// //     );
// //   }

// //   return (
// //     <LinearGradient colors={["#121212", "#1E1E1E", "#252525"]} style={{ flex: 1, paddingTop: 35 }}>
// //       <ScrollView style={styles.container}>
// //         {/* Hero Section */}
// //         <LinearGradient colors={['#BB86FC', '#FF6B81']} style={styles.heroSection}>
// //           <View style={styles.heroOverlay}>
// //             <Text style={styles.heroTitle}>Discover the Latest Fashion Trends</Text>
// //             <Text style={styles.heroSubtitle}>Shop Now and Save Big on Your Favorites!</Text>
// //             <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate('profile-page/product-detail', { product: products[0] })}>
// //               <Text style={styles.heroButtonText}>Shop Now</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </LinearGradient>

// //         {/* Enhanced Header */}
// //         <View style={styles.header}>
// //           <Text style={styles.title}>Fashion Store</Text>
// //           <View style={styles.headerIcons}>
// //             <TouchableOpacity style={styles.iconButton}>
// //               <Ionicons name="search-outline" size={24} color="#fff" />
// //             </TouchableOpacity>
// //             <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.iconButton}>
// //               <MaterialIcons name="filter-list" size={24} color="#fff" />
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate('profile-page/cart')}>
// //               <Ionicons name="cart-outline" size={24} color="white" />
// //               {cartProducts.length > 0 && (
// //                 <View style={styles.cartBadge}>
// //                   <Text style={styles.cartBadgeText}>{cartProducts.length}</Text>
// //                 </View>
// //               )}
// //             </TouchableOpacity>
// //           </View>
// //         </View>

// //         {/* Filters Section with Animation */}
// //         <Animated.View
// //           style={[
// //             styles.filterContainer,
// //             {
// //               opacity: filterOpacity,
// //               transform: [{ translateY: filterTranslateY }],
// //               display: showFilters ? 'flex' : 'none', // Hide when not shown to prevent interaction
// //             },
// //           ]}
// //         >
// //           <Text style={styles.filterTitle}>Filters</Text>
// //           <Text style={styles.filterSectionTitle}>Category</Text>
// //           <View style={styles.filterOptions}>
// //             {categories.map(category => (
// //               <TouchableOpacity
// //                 key={category}
// //                 style={[styles.filterOption, filters.category === category && styles.selectedFilterOption]}
// //                 onPress={() => {
// //                   setFilters({
// //                     ...filters,
// //                     category: filters.category === category ? null : category,
// //                     subcategory: null,
// //                   });
// //                   setCurrentPage(1);
// //                 }}
// //               >
// //                 <Text style={styles.filterOptionText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //           {filters.category && (
// //             <>
// //               <Text style={styles.filterSectionTitle}>Subcategory</Text>
// //               <View style={styles.filterOptions}>
// //                 {subcategories[filters.category]?.map(subcategory => (
// //                   <TouchableOpacity
// //                     key={subcategory}
// //                     style={[styles.filterOption, filters.subcategory === subcategory && styles.selectedFilterOption]}
// //                     onPress={() => {
// //                       setFilters({ ...filters, subcategory: filters.subcategory === subcategory ? null : subcategory });
// //                       setCurrentPage(1);
// //                     }}
// //                   >
// //                     <Text style={styles.filterOptionText}>{subcategory}</Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //             </>
// //           )}
// //           <Text style={styles.filterSectionTitle}>Brand</Text>
// //           <View style={styles.filterOptions}>
// //             {brands.map(brand => (
// //               <TouchableOpacity
// //                 key={brand}
// //                 style={[styles.filterOption, filters.brand === brand && styles.selectedFilterOption]}
// //                 onPress={() => {
// //                   setFilters({ ...filters, brand: filters.brand === brand ? null : brand });
// //                   setCurrentPage(1);
// //                 }}
// //               >
// //                 <Text style={styles.filterOptionText}>{brand}</Text>
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //           <Text style={styles.filterSectionTitle}>Price Range: ${filters.minPrice} - ${filters.maxPrice}</Text>
// //           <Slider
// //             style={{ width: '100%', height: 40 }}
// //             minimumValue={0}
// //             maximumValue={1000}
// //             minimumTrackTintColor="#BB86FC"
// //             maximumTrackTintColor="#FFFFFF"
// //             thumbTintColor="#BB86FC"
// //             value={filters.maxPrice}
// //             onValueChange={(value) => {
// //               setFilters({ ...filters, maxPrice: value });
// //               setCurrentPage(1);
// //             }}
// //           />
// //           <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
// //           <View style={styles.ratingFilter}>
// //             {ratings.map(rating => (
// //               <TouchableOpacity
// //                 key={rating}
// //                 onPress={() => {
// //                   setFilters({ ...filters, rating: filters.rating === rating ? null : rating });
// //                   setCurrentPage(1);
// //                 }}
// //               >
// //                 <FontAwesome
// //                   name={filters.rating && rating <= filters.rating ? "star" : "star-o"}
// //                   size={24}
// //                   color={filters.rating && rating <= filters.rating ? "#FFD700" : "#fff"}
// //                   style={styles.starIcon}
// //                 />
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //           <View style={styles.toggleFilters}>
// //             <TouchableOpacity
// //               style={[styles.toggleFilter, filters.featured && styles.selectedToggleFilter]}
// //               onPress={() => {
// //                 setFilters({ ...filters, featured: !filters.featured });
// //                 setCurrentPage(1);
// //               }}
// //             >
// //               <Text style={styles.toggleFilterText}>Featured</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               style={[styles.toggleFilter, filters.newArrival && styles.selectedToggleFilter]}
// //               onPress={() => {
// //                 setFilters({ ...filters, newArrival: !filters.newArrival });
// //                 setCurrentPage(1);
// //               }}
// //             >
// //               <Text style={styles.toggleFilterText}>New Arrivals</Text>
// //             </TouchableOpacity>
// //           </View>
// //           <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
// //             <Text style={styles.resetButtonText}>Reset Filters</Text>
// //           </TouchableOpacity>
// //         </Animated.View>

// //         {/* Promotional Banners */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Hot Deals 🔥</Text>
// //           <FlatList
// //             horizontal
// //             data={promotionalBanners}
// //             keyExtractor={(item) => item.id}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity style={[styles.bannerCard, { backgroundColor: item.color }]}>
// //                 <Image source={{ uri: item.image }} style={styles.bannerImage} />
// //                 <Text style={styles.bannerText}>{item.title}</Text>
// //               </TouchableOpacity>
// //             )}
// //             showsHorizontalScrollIndicator={false}
// //             contentContainerStyle={styles.bannerList}
// //           />
// //         </View>

// //         {/* Categories Section */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Shop by Category</Text>
// //           <FlatList
// //             horizontal
// //             data={categories}
// //             keyExtractor={(item) => item}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity
// //                 style={styles.categoryCard}
// //                 onPress={() => {
// //                   setFilters({ ...filters, category: item, subcategory: null });
// //                   setCurrentPage(1); // Reset to first page when category changes
// //                 }}
// //               >
// //                 <Text style={styles.categoryIcon}>{categoryIcons[item]}</Text>
// //                 <Text style={styles.categoryText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
// //               </TouchableOpacity>
// //             )}
// //             showsHorizontalScrollIndicator={false}
// //             contentContainerStyle={styles.categoryList}
// //           />
// //         </View>


// //         {/* Product Grid */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Our Products</Text>
// //           <View style={styles.grid}>
// //             {paginatedProducts.length > 0 ? (
// //               paginatedProducts.map((product) => (
// //                 <View key={product._id} style={styles.card}>
// //                   {product.featured && (
// //                     <View style={styles.featuredBadge}>
// //                       <Text style={styles.featuredBadgeText}>Featured</Text>
// //                     </View>
// //                   )}
// //                   {product.newArrival && (
// //                     <View style={styles.newBadge}>
// //                       <Text style={styles.newBadgeText}>New</Text>
// //                     </View>
// //                   )}
// //                   <TouchableOpacity onPress={() => navigation.navigate('profile-page/product-detail', { product })}>
// //                     <Image source={{ uri: product.images[0] }} style={styles.image} />
// //                   </TouchableOpacity>
// //                   <Text style={styles.discount}>
// //                     {calculateDiscountPercentage(product.price, product.salePrice)} OFF
// //                   </Text>
// //                   <View style={styles.ratingContainer}>
// //                     <FontAwesome name="star" size={12} color="#FFD700" />
// //                     <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
// //                     <Text style={styles.reviewsText}>({product.numReviews})</Text>
// //                   </View>
// //                   <Text style={styles.name}>{product.name}</Text>
// //                   <Text style={styles.brand}>{product.brand}</Text>
// //                   <View style={styles.priceContainer}>
// //                     <Text style={styles.price}>${product.salePrice.toFixed(2)}</Text>
// //                     <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
// //                   </View>
// //                   <TouchableOpacity
// //                     style={styles.cartButton}
// //                     onPress={() => handleAddToCart(product)}
// //                   >
// //                     <Ionicons name="cart-outline" size={20} color="white" />
// //                   </TouchableOpacity>
// //                 </View>
// //               ))
// //             ) : (
// //               <View style={styles.noResults}>
// //                 <Text style={styles.noResultsText}>No products match your filters</Text>
// //                 <TouchableOpacity onPress={resetFilters}>
// //                   <Text style={styles.resetText}>Reset filters</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}
// //           </View>

// //           {/* Pagination Component */}
// //           {totalPages > 1 && (
// //             <View style={styles.paginationContainer}>
// //               <TouchableOpacity
// //                 style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
// //                 onPress={goToPreviousPage}
// //                 disabled={currentPage === 1}
// //               >
// //                 <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#9E9E9E" : "#FFFFFF"} />
// //               </TouchableOpacity>
// //               <View style={styles.pageNumbers}>
// //                 {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
// //                   <TouchableOpacity
// //                     key={page}
// //                     style={[styles.pageNumber, currentPage === page && styles.activePageNumber]}
// //                     onPress={() => goToPage(page)}
// //                   >
// //                     <Text style={[styles.pageNumberText, currentPage === page && styles.activePageNumberText]}>
// //                       {page}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //               <TouchableOpacity
// //                 style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
// //                 onPress={goToNextPage}
// //                 disabled={currentPage === totalPages}
// //               >
// //                 <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#9E9E9E" : "#FFFFFF"} />
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //         </View>

// //         {/* Footer Section */}
// //         <View style={styles.footer}>
// //           <Text style={styles.footerTitle}>Stay Connected</Text>
// //           <Text style={styles.footerText}>Sign up for our newsletter to get the latest updates and exclusive offers!</Text>
// //           <TouchableOpacity style={styles.footerButton}>
// //             <Text style={styles.footerButtonText}>Subscribe Now</Text>
// //           </TouchableOpacity>
// //           <View style={styles.footerLinks}>
// //             <TouchableOpacity>
// //               <Text style={styles.footerLink}>About Us</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity>
// //               <Text style={styles.footerLink}>Contact</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity>
// //               <Text style={styles.footerLink}>FAQs</Text>
// //             </TouchableOpacity>
// //           </View>
// //           <Text style={styles.footerCopyright}>© 2025 Fashion Store. All rights reserved.</Text>
// //         </View>
// //       </ScrollView>
// //     </LinearGradient>
// //   );
// // }

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { View, TextInput, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ToastAndroid, FlatList, Animated } from 'react-native';
// import Slider from '@react-native-community/slider';
// import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import { useAuth } from '../AuthContext';
// import { useNavigation } from 'expo-router';
// import LottieView from 'lottie-react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import axios from 'axios';

// export default function FashionShopScreen() {
//   const { cartProducts, setCartProducts } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [products, setProducts] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [count, setCount] = useState(0);
//   const productsPerPage = 6;
//   const [filters, setFilters] = useState({
//     keyword: '',
//     category: null,
//     subcategory: null,
//     brand: null,
//     minPrice: 0,
//     maxPrice: 1000,
//     rating: null,
//     featured: false,
//     newArrival: false,
//     sort: 'newest',
//   });

//   const filterAnimation = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();

//   const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Puma', 'Levi\'s'];
//   const categories = ['men', 'women', 'kids', 'accessories'];
//   const subcategories = {
//     men: ['T-Shirts', 'Jeans', 'Shirts', 'Jackets', 'Shoes'],
//     women: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Shoes'],
//     kids: ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Shoes'],
//     accessories: ['Watches', 'Bags', 'Jewelry', 'Hats', 'Sunglasses'],
//   };
//   const ratings = [1, 2, 3, 4, 5];

//   useEffect(() => {
//     Animated.timing(filterAnimation, {
//       toValue: showFilters ? 1 : 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [showFilters]);

//   const fetchProducts = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const params = {
//         pageNumber: currentPage,
//         pageSize: productsPerPage,
//         ...filters
//       };

//       // Clean up params - remove null/empty values
//       Object.keys(params).forEach(key => {
//         if (params[key] === null || params[key] === '' || params[key] === false) {
//           delete params[key];
//         }
//       });

//       const response = await axios.get('https://fashionista-red.vercel.app/api/products', {
//         params,
//         timeout: 5000,
//       });


//       setProducts(response.data.products);
//       setTotalPages(response.data.pages);
//       setCount(response.data.count);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       ToastAndroid.show('Failed to fetch products. Please check your connection.', ToastAndroid.SHORT);
//     } finally {
//       setIsLoading(false);
//     }
//     // Add all dependencies that affect the API call
//   }, [currentPage, filters.keyword, filters.category, filters.subcategory, filters.brand, filters.minPrice, filters.maxPrice, filters.rating, filters.featured, filters.newArrival, filters.sort, productsPerPage]);

//   // Update the useEffect to prevent unnecessary calls
//   useEffect(() => {
//     const fetchTimer = setTimeout(() => {
//       fetchProducts();
//     }, 300); // Add slight debounce for filter changes

//     return () => clearTimeout(fetchTimer);
//   }, [fetchProducts]);

//   const filterOpacity = filterAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1],
//   });

//   const filterTranslateY = filterAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-20, 0],
//   });

//   const handleAddToCart = (product) => {
//     const cartItemId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
//     const existingProductIndex = cartProducts.findIndex(
//       (item) =>
//         item._id === product._id &&
//         item.selectedSize === product.sizes[0].size &&
//         item.selectedColor === product.colors[0].color
//     );
//     if (existingProductIndex === -1) {
//       setCartProducts((prev) => [
//         ...prev,
//         {
//           ...product,
//           quantity: 1,
//           selectedSize: product.sizes[0].size,
//           selectedColor: product.colors[0].color,
//           cartItemId,
//           image: product.images[0],
//         },
//       ]);
//     } else {
//       const updatedCart = [...cartProducts];
//       updatedCart[existingProductIndex].quantity += 1;
//       setCartProducts(updatedCart);
//     }
//     ToastAndroid.show('Added to cart successfully!', ToastAndroid.SHORT);
//   };

//   const calculateDiscountPercentage = (price, salePrice) => {
//     if (!salePrice || salePrice >= price) return '';
//     return Math.round(((price - salePrice) / price) * 100) + '%';
//   };

//   const resetFilters = () => {
//     setFilters({
//       keyword: '',
//       category: null,
//       subcategory: null,
//       brand: null,
//       minPrice: 0,
//       maxPrice: 1000,
//       rating: null,
//       featured: false,
//       newArrival: false,
//       sort: 'newest',
//     });
//     setCurrentPage(1);
//   };

//   const promotionalBanners = [
//     { id: '1', title: 'Summer Sale Up to 50% Off!', color: '#FF6B81', image: 'https://img.freepik.com/free-photo/summer-sale_53876-138860.jpg' },
//     { id: '2', title: 'New Arrivals in Accessories!', color: '#03DAC6', image: 'https://img.freepik.com/free-photo/accessories_53876-138861.jpg' },
//     { id: '3', title: 'Free Shipping on Orders Over $200!', color: '#FFD700', image: 'https://img.freepik.com/free-photo/free-shipping_53876-138862.jpg' },
//   ];

//   const categoryIcons = {
//     men: '👕',
//     women: '👗',
//     kids: '👶',
//     accessories: '👜',
//   };

//   // Pagination navigation handlers
//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPage = (page) => {
//     setCurrentPage(page);
//   };

//   if (isLoading) {
//     return (
//       <LinearGradient
//         colors={["#121212", "#1E1E1E", "#252525"]}
//         style={[styles.container, styles.loadingContainer]}
//       >
//         <LottieView
//           source={{ uri: 'https://lottie.host/cd4d1dff-256b-461b-8b32-0cd291ff2e26/UZnRwRqeiq.lottie' }}
//           autoPlay
//           loop
//           style={styles.lottie}
//         />
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={["#121212", "#1E1E1E", "#252525"]} style={{ flex: 1, paddingTop: 35 }}>
//       <ScrollView style={styles.container}>
//         {/* Hero Section */}
//         <LinearGradient colors={['#BB86FC', '#FF6B81']} style={styles.heroSection}>
//           <View style={styles.heroOverlay}>
//             <Text style={styles.heroTitle}>Discover the Latest Fashion Trends</Text>
//             <Text style={styles.heroSubtitle}>Shop Now and Save Big on Your Favorites!</Text>
//             <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate('profile-page/product-detail', { product: products[0] })}>
//               <Text style={styles.heroButtonText}>Shop Now</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>

//         {/* Enhanced Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Fashion Store</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity style={styles.iconButton}>
//               <Ionicons name="search-outline" size={24} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.iconButton}>
//               <MaterialIcons name="filter-list" size={24} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate('profile-page/cart')}>
//               <Ionicons name="cart-outline" size={24} color="white" />
//               {cartProducts.length > 0 && (
//                 <View style={styles.cartBadge}>
//                   <Text style={styles.cartBadgeText}>{cartProducts.length}</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Filters Section with Animation */}
//         <Animated.View
//           style={[
//             styles.filterContainer,
//             {
//               opacity: filterOpacity,
//               transform: [{ translateY: filterTranslateY }],
//               display: showFilters ? 'flex' : 'none',
//             },
//           ]}
//         >
//           <Text style={styles.filterTitle}>Filters</Text>

//           <Text style={styles.filterSectionTitle}>Keyword</Text>
//           <View style={styles.searchContainer}>
//             <Ionicons name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search products..."
//               placeholderTextColor="#9E9E9E"
//               value={filters.keyword}
//               onChangeText={(text) => setFilters({ ...filters, keyword: text })}
//             />
//           </View>

//           <Text style={styles.filterSectionTitle}>Category</Text>
//           <View style={styles.filterOptions}>
//             {categories.map(category => (
//               <TouchableOpacity
//                 key={category}
//                 style={[styles.filterOption, filters.category === category && styles.selectedFilterOption]}
//                 onPress={() => {
//                   setFilters({
//                     ...filters,
//                     category: filters.category === category ? null : category,
//                     subcategory: null,
//                   });
//                   setCurrentPage(1);
//                 }}
//               >
//                 <Text style={styles.filterOptionText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {filters.category && (
//             <>
//               <Text style={styles.filterSectionTitle}>Subcategory</Text>
//               <View style={styles.filterOptions}>
//                 {subcategories[filters.category]?.map(subcategory => (
//                   <TouchableOpacity
//                     key={subcategory}
//                     style={[styles.filterOption, filters.subcategory === subcategory && styles.selectedFilterOption]}
//                     onPress={() => {
//                       setFilters({ ...filters, subcategory: filters.subcategory === subcategory ? null : subcategory });
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <Text style={styles.filterOptionText}>{subcategory}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </>
//           )}

//           <Text style={styles.filterSectionTitle}>Brand</Text>
//           <View style={styles.filterOptions}>
//             {brands.map(brand => (
//               <TouchableOpacity
//                 key={brand}
//                 style={[styles.filterOption, filters.brand === brand && styles.selectedFilterOption]}
//                 onPress={() => {
//                   setFilters({ ...filters, brand: filters.brand === brand ? null : brand });
//                   setCurrentPage(1);
//                 }}
//               >
//                 <Text style={styles.filterOptionText}>{brand}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.filterSectionTitle}>Price Range: ${filters.minPrice} - ${filters.maxPrice}</Text>
//           <Slider
//             style={{ width: '100%', height: 40 }}
//             minimumValue={0}
//             maximumValue={1000}
//             minimumTrackTintColor="#BB86FC"
//             maximumTrackTintColor="#FFFFFF"
//             thumbTintColor="#BB86FC"
//             value={filters.maxPrice}
//             onValueChange={(value) => {
//               setFilters({ ...filters, maxPrice: value });
//               setCurrentPage(1);
//             }}
//           />

//           <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
//           <View style={styles.ratingFilter}>
//             {ratings.map(rating => (
//               <TouchableOpacity
//                 key={rating}
//                 onPress={() => {
//                   setFilters({ ...filters, rating: filters.rating === rating ? null : rating });
//                   setCurrentPage(1);
//                 }}
//               >
//                 <FontAwesome
//                   name={filters.rating && rating <= filters.rating ? "star" : "star-o"}
//                   size={24}
//                   color={filters.rating && rating <= filters.rating ? "#FFD700" : "#fff"}
//                   style={styles.starIcon}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.filterSectionTitle}>Sort By</Text>
//           <View style={styles.filterOptions}>
//             <TouchableOpacity
//               style={[styles.filterOption, filters.sort === 'newest' && styles.selectedFilterOption]}
//               onPress={() => {
//                 setFilters({ ...filters, sort: 'newest' });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.filterOptionText}>Newest</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.filterOption, filters.sort === 'price-asc' && styles.selectedFilterOption]}
//               onPress={() => {
//                 setFilters({ ...filters, sort: 'price-asc' });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.filterOptionText}>Price: Low to High</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.filterOption, filters.sort === 'price-desc' && styles.selectedFilterOption]}
//               onPress={() => {
//                 setFilters({ ...filters, sort: 'price-desc' });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.filterOptionText}>Price: High to Low</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.filterOption, filters.sort === 'rating' && styles.selectedFilterOption]}
//               onPress={() => {
//                 setFilters({ ...filters, sort: 'rating' });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.filterOptionText}>Top Rated</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.toggleFilters}>
//             <TouchableOpacity
//               style={[styles.toggleFilter, filters.featured && styles.selectedToggleFilter]}
//               onPress={() => {
//                 setFilters({ ...filters, featured: !filters.featured });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.toggleFilterText}>Featured</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.toggleFilter, filters.newArrival && styles.selectedToggleFilter]}
//               onPress={() => {
//                 setFilters({ ...filters, newArrival: !filters.newArrival });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.toggleFilterText}>New Arrivals</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
//             <Text style={styles.resetButtonText}>Reset Filters</Text>
//           </TouchableOpacity>
//         </Animated.View>

//         {/* Promotional Banners */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Hot Deals 🔥</Text>
//           <FlatList
//             horizontal
//             data={promotionalBanners}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={[styles.bannerCard, { backgroundColor: item.color }]}>
//                 <Image source={{ uri: item.image }} style={styles.bannerImage} />
//                 <Text style={styles.bannerText}>{item.title}</Text>
//               </TouchableOpacity>
//             )}
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.bannerList}
//           />
//         </View>

//         {/* Categories Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Shop by Category</Text>
//           <FlatList
//             horizontal
//             data={categories}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.categoryCard}
//                 onPress={() => {
//                   setFilters({ ...filters, category: item, subcategory: null });
//                   setCurrentPage(1);
//                 }}
//               >
//                 <Text style={styles.categoryIcon}>{categoryIcons[item]}</Text>
//                 <Text style={styles.categoryText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
//               </TouchableOpacity>
//             )}
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoryList}
//           />
//         </View>

//         {/* Product Grid */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Our Products</Text>
//           <View style={styles.grid}>
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <View key={product._id} style={styles.card}>
//                   {product.featured && (
//                     <View style={styles.featuredBadge}>
//                       <Text style={styles.featuredBadgeText}>Featured</Text>
//                     </View>
//                   )}
//                   {product.newArrival && (
//                     <View style={styles.newBadge}>
//                       <Text style={styles.newBadgeText}>New</Text>
//                     </View>
//                   )}
//                   <TouchableOpacity onPress={() => navigation.navigate('profile-page/product-detail', { product })}>
//                     <Image source={{ uri: product.images[0] }} style={styles.image} />
//                   </TouchableOpacity>
//                   {product.salePrice && product.salePrice < product.price && (
//                     <Text style={styles.discount}>
//                       {calculateDiscountPercentage(product.price, product.salePrice)} OFF
//                     </Text>
//                   )}
//                   <View style={styles.ratingContainer}>
//                     <FontAwesome name="star" size={12} color="#FFD700" />
//                     <Text style={styles.ratingText}>{product.rating?.toFixed(1) || '0.0'}</Text>
//                     <Text style={styles.reviewsText}>({product.numReviews || 0})</Text>
//                   </View>
//                   <Text style={styles.name}>{product.name}</Text>
//                   <Text style={styles.brand}>{product.brand}</Text>
//                   <View style={styles.priceContainer}>
//                     <Text style={styles.price}>${product.salePrice?.toFixed(2) || product.price?.toFixed(2)}</Text>
//                     {product.salePrice && product.salePrice < product.price && (
//                       <Text style={styles.originalPrice}>${product.price?.toFixed(2)}</Text>
//                     )}
//                   </View>
//                   <TouchableOpacity
//                     style={styles.cartButton}
//                     onPress={() => handleAddToCart(product)}
//                   >
//                     <Ionicons name="cart-outline" size={20} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               ))
//             ) : (
//               <View style={styles.noResults}>
//                 <Text style={styles.noResultsText}>No products match your filters</Text>
//                 <TouchableOpacity onPress={resetFilters}>
//                   <Text style={styles.resetText}>Reset filters</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {/* Pagination Component */}
//           {totalPages > 1 && (
//             <View style={styles.paginationContainer}>
//               <TouchableOpacity
//                 style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
//                 onPress={goToPreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#9E9E9E" : "#FFFFFF"} />
//               </TouchableOpacity>
//               <View style={styles.pageNumbers}>
//                 {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//                   <TouchableOpacity
//                     key={page}
//                     style={[styles.pageNumber, currentPage === page && styles.activePageNumber]}
//                     onPress={() => goToPage(page)}
//                   >
//                     <Text style={[styles.pageNumberText, currentPage === page && styles.activePageNumberText]}>
//                       {page}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               <TouchableOpacity
//                 style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
//                 onPress={goToNextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#9E9E9E" : "#FFFFFF"} />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Footer Section */}
//         <View style={styles.footer}>
//           <Text style={styles.footerTitle}>Stay Connected</Text>
//           <Text style={styles.footerText}>Sign up for our newsletter to get the latest updates and exclusive offers!</Text>
//           <TouchableOpacity style={styles.footerButton}>
//             <Text style={styles.footerButtonText}>Subscribe Now</Text>
//           </TouchableOpacity>
//           <View style={styles.footerLinks}>
//             <TouchableOpacity>
//               <Text style={styles.footerLink}>About Us</Text>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.footerLink}>Contact</Text>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.footerLink}>FAQs</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.footerCopyright}>© 2025 Fashion Store. All rights reserved.</Text>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100%',
//     width: '100%',
//   },
//   lottie: {
//     width: 200,
//     height: 200,
//   },
//   heroSection: {
//     borderRadius: 16,
//     marginBottom: 16,
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heroOverlay: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 16,
//     padding: 20,
//     alignItems: 'center',
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//   },
//   heroTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: '#FFD700',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   heroButton: {
//     backgroundColor: '#03DAC6',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 24,
//   },
//   heroButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     marginBottom: 16,
//     backgroundColor: 'rgba(30, 30, 30, 0.9)',
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   iconButton: {
//     padding: 8,
//     backgroundColor: '#333',
//     borderRadius: 50,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#BB86FC',
//     marginBottom: 12,
//   },
//   bannerList: {
//     paddingHorizontal: 4,
//   },
//   bannerCard: {
//     width: 250,
//     height: 120,
//     borderRadius: 12,
//     marginRight: 12,
//     overflow: 'hidden',
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bannerImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     opacity: 0.7,
//   },
//   bannerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     paddingHorizontal: 16,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   categoryList: {
//     paddingHorizontal: 4,
//   },
//   categoryCard: {
//     width: 80,
//     height: 100,
//     borderRadius: 12,
//     backgroundColor: '#2C2C2C',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     shadowColor: '#BB86FC',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   categoryIcon: {
//     fontSize: 30,
//     marginBottom: 8,
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingBottom: 20,
//   },
//   card: {
//     width: '48%',
//     backgroundColor: '#1E1E1E',
//     padding: 10,
//     marginBottom: 16,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//     position: 'relative',
//   },
//   image: {
//     width: '100%',
//     height: 150,
//     resizeMode: 'cover',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   discount: {
//     backgroundColor: '#BB86FC',
//     color: '#000',
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     fontSize: 12,
//     fontWeight: 'bold',
//     position: 'absolute',
//     top: 18,
//     left: 18,
//     borderRadius: 4,
//   },
//   featuredBadge: {
//     backgroundColor: '#FF0266',
//     position: 'absolute',
//     top: 18,
//     right: 18,
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//     zIndex: 1,
//   },
//   featuredBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   newBadge: {
//     backgroundColor: '#03DAC6',
//     position: 'absolute',
//     top: 18,
//     right: 18,
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//     zIndex: 1,
//   },
//   newBadgeText: {
//     color: '#000',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   ratingText: {
//     color: '#FFD700',
//     fontSize: 12,
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
//   reviewsText: {
//     color: '#9E9E9E',
//     fontSize: 10,
//     marginLeft: 4,
//   },
//   name: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//     marginBottom: 2,
//   },
//   brand: {
//     fontSize: 12,
//     color: '#BB86FC',
//     marginBottom: 4,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   price: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#03DAC6',
//     marginRight: 8,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#9E9E9E',
//     textDecorationLine: 'line-through',
//   },
//   cartButton: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//     backgroundColor: '#BB86FC',
//     padding: 6,
//     borderRadius: 20,
//   },
//   cartIconContainer: {
//     position: 'relative',
//     padding: 8,
//     backgroundColor: '#3700B3',
//     borderRadius: 50,
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: '#FF0266',
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   filterContainer: {
//     backgroundColor: '#1E1E1E',
//     padding: 16,
//     borderRadius: 10,
//     margin: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   filterTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   filterSectionTitle: {
//     color: '#BB86FC',
//     fontSize: 14,
//     fontWeight: '600',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   filterOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 8,
//   },
//   filterOption: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     backgroundColor: '#333',
//   },
//   selectedFilterOption: {
//     backgroundColor: '#BB86FC',
//   },
//   filterOptionText: {
//     color: '#fff',
//     fontSize: 12,
//   },
//   ratingFilter: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   starIcon: {
//     marginRight: 4,
//   },
//   toggleFilters: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   toggleFilter: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#BB86FC',
//   },
//   selectedToggleFilter: {
//     backgroundColor: '#BB86FC',
//   },
//   toggleFilterText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   resetButton: {
//     backgroundColor: '#FF0266',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   resetButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   noResults: {
//     width: '100%',
//     alignItems: 'center',
//     padding: 20,
//   },
//   noResultsText: {
//     color: '#fff',
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   resetText: {
//     color: '#BB86FC',
//     textDecorationLine: 'underline',
//   },
//   footer: {
//     backgroundColor: '#1E1E1E',
//     padding: 20,
//     marginBottom: 130,
//     borderRadius: 16,
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   footerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#BB86FC',
//     marginBottom: 8,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#CCCCCC',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   footerButton: {
//     backgroundColor: '#FFD700',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 24,
//     marginBottom: 16,
//   },
//   footerButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   footerLinks: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 16,
//   },
//   footerLink: {
//     fontSize: 14,
//     color: '#BB86FC',
//     textDecorationLine: 'underline',
//   },
//   footerCopyright: {
//     fontSize: 12,
//     color: '#AAAAAA',
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   paginationButton: {
//     padding: 10,
//     backgroundColor: '#333',
//     borderRadius: 50,
//     marginHorizontal: 8,
//   },
//   disabledButton: {
//     backgroundColor: '#2C2C2C',
//   },
//   pageNumbers: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   pageNumber: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     backgroundColor: '#333',
//   },
//   activePageNumber: {
//     backgroundColor: '#BB86FC',
//   },
//   pageNumberText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   activePageNumberText: {
//     color: '#000000',
//   },
// });


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { View, TextInput, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ToastAndroid, FlatList, Animated, ActivityIndicator, RefreshControl } from 'react-native';
// import Slider from '@react-native-community/slider';
// import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import { useAuth } from '../AuthContext';
// import { useNavigation } from 'expo-router';
// import LottieView from 'lottie-react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import axios from 'axios';

// export default function FashionShopScreen() {
//   const { cartProducts, setCartProducts } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [products, setProducts] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [count, setCount] = useState(0);
//   const productsPerPage = 6;
//   const [filters, setFilters] = useState({
//     keyword: '',
//     category: null,
//     subcategory: null,
//     brand: null,
//     minPrice: 0,
//     maxPrice: 1000,
//     rating: null,
//     featured: false,
//     newArrival: false,
//     sort: 'newest',
//   });

//   const filterAnimation = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();

//   const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Puma', 'Levi\'s'];
//   const categories = ['men', 'women', 'kids', 'accessories'];
//   const subcategories = {
//     men: ['T-Shirts', 'Jeans', 'Shirts', 'Jackets', 'Shoes'],
//     women: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Shoes'],
//     kids: ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Shoes'],
//     accessories: ['Watches', 'Bags', 'Jewelry', 'Hats', 'Sunglasses'],
//   };
//   const ratings = [1, 2, 3, 4, 5];

//   useEffect(() => {
//     Animated.timing(filterAnimation, {
//       toValue: showFilters ? 1 : 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [showFilters]);

//   const fetchProducts = useCallback(async (isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setIsRefreshing(true);
//       } else {
//         setIsLoading(true);
//       }

//       const params = {
//         pageNumber: isRefresh ? 1 : currentPage,
//         pageSize: productsPerPage,
//         ...filters
//       };

//       // Clean up params - remove null/empty values
//       Object.keys(params).forEach(key => {
//         if (params[key] === null || params[key] === '' || params[key] === false) {
//           delete params[key];
//         }
//       });

//       const response = await axios.get('https://fashionista-red.vercel.app/api/products', {
//         params,
//         timeout: 5000,
//       });

//       setProducts(response.data.products);
//       setTotalPages(response.data.pages);
//       setCount(response.data.count);

//       // If refreshing, reset to first page
//       if (isRefresh) {
//         setCurrentPage(1);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       ToastAndroid.show('Failed to fetch products. Please check your connection.', ToastAndroid.SHORT);
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   }, [currentPage, filters.keyword, filters.category, filters.subcategory, filters.brand, filters.minPrice, filters.maxPrice, filters.rating, filters.featured, filters.newArrival, filters.sort, productsPerPage]);

//   useEffect(() => {
//     const fetchTimer = setTimeout(() => {
//       fetchProducts();
//     }, 300); // Add slight debounce for filter changes

//     return () => clearTimeout(fetchTimer);
//   }, [fetchProducts]);

//   const filterOpacity = filterAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1],
//   });

//   const filterTranslateY = filterAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-20, 0],
//   });

//   const handleAddToCart = (product) => {
//     const cartItemId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
//     const existingProductIndex = cartProducts.findIndex(
//       (item) =>
//         item._id === product._id &&
//         item.selectedSize === product.sizes[0].size &&
//         item.selectedColor === product.colors[0].color
//     );
//     if (existingProductIndex === -1) {
//       setCartProducts((prev) => [
//         ...prev,
//         {
//           ...product,
//           quantity: 1,
//           selectedSize: product.sizes[0].size,
//           selectedColor: product.colors[0].color,
//           cartItemId,
//           image: product.images[0],
//         },
//       ]);
//     } else {
//       const updatedCart = [...cartProducts];
//       updatedCart[existingProductIndex].quantity += 1;
//       setCartProducts(updatedCart);
//     }
//     ToastAndroid.show('Added to cart successfully!', ToastAndroid.SHORT);
//   };

//   const calculateDiscountPercentage = (price, salePrice) => {
//     if (!salePrice || salePrice >= price) return '';
//     return Math.round(((price - salePrice) / price) * 100) + '%';
//   };

//   const resetFilters = () => {
//     setFilters({
//       keyword: '',
//       category: null,
//       subcategory: null,
//       brand: null,
//       minPrice: 0,
//       maxPrice: 1000,
//       rating: null,
//       featured: false,
//       newArrival: false,
//       sort: 'newest',
//     });
//     setCurrentPage(1);
//   };

//   const promotionalBanners = [
//     { id: '1', title: 'Summer Sale Up to 50% Off!', color: '#FF6B81', image: 'https://img.freepik.com/free-photo/summer-sale_53876-138860.jpg' },
//     { id: '2', title: 'New Arrivals in Accessories!', color: '#03DAC6', image: 'https://img.freepik.com/free-photo/accessories_53876-138861.jpg' },
//     { id: '3', title: 'Free Shipping on Orders Over $200!', color: '#FFD700', image: 'https://img.freepik.com/free-photo/free-shipping_53876-138862.jpg' },
//   ];

//   const categoryIcons = {
//     men: '👕',
//     women: '👗',
//     kids: '👶',
//     accessories: '👜',
//   };

//   // Pagination navigation handlers
//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPage = (page) => {
//     setCurrentPage(page);
//   };

//   if (isLoading) {
//     return (
//       <LinearGradient
//         colors={["#121212", "#1E1E1E", "#252525"]}
//         style={[styles.container, styles.loadingContainer]}
//       >
//         <LottieView
//           source={{ uri: 'https://lottie.host/cd4d1dff-256b-461b-8b32-0cd291ff2e26/UZnRwRqeiq.lottie' }}
//           autoPlay
//           loop
//           style={styles.lottie}
//         />
//       </LinearGradient>
//     );
//   }

//   return (
//     <LinearGradient colors={["#121212", "#1E1E1E", "#252525"]} style={{ flex: 1, paddingTop: 35 }}>
//       <ScrollView 
//         style={styles.container}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={() => fetchProducts(true)}
//             colors={['#BB86FC']}
//             tintColor="#BB86FC"
//           />
//         }
//       >
//         {/* Hero Section */}
//         <LinearGradient colors={['#BB86FC', '#FF6B81']} style={styles.heroSection}>
//           <View style={styles.heroOverlay}>
//             <Text style={styles.heroTitle}>Discover the Latest Fashion Trends</Text>
//             <Text style={styles.heroSubtitle}>Shop Now and Save Big on Your Favorites!</Text>
//             <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate('profile-page/product-detail', { product: products[0] })}>
//               <Text style={styles.heroButtonText}>Shop Now</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>

//         {/* Enhanced Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Fashion Store</Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity 
//               onPress={() => fetchProducts(true)} 
//               style={styles.iconButton}
//               disabled={isRefreshing}
//             >
//               {isRefreshing ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Ionicons name="refresh-outline" size={24} color="#fff" />
//               )}
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.iconButton}>
//               <MaterialIcons name="filter-list" size={24} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate('profile-page/cart')}>
//               <Ionicons name="cart-outline" size={24} color="white" />
//               {cartProducts.length > 0 && (
//                 <View style={styles.cartBadge}>
//                   <Text style={styles.cartBadgeText}>{cartProducts.length}</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Rest of your component remains the same... */}
//         {/* Filters Section with Animation */}
//         <Animated.View
//           style={[
//             styles.filterContainer,
//             {
//               opacity: filterOpacity,
//               transform: [{ translateY: filterTranslateY }],
//               display: showFilters ? 'flex' : 'none',
//             },
//           ]}
//         >
//           <Text style={styles.filterTitle}>Filters</Text>

//           <Text style={styles.filterSectionTitle}>Keyword</Text>
//           <View style={styles.searchContainer}>
//             <Ionicons name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search products..."
//               placeholderTextColor="#9E9E9E"
//               value={filters.keyword}
//               onChangeText={(text) => setFilters({ ...filters, keyword: text })}
//             />
//           </View>

//           <Text style={styles.filterSectionTitle}>Category</Text>
//           <View style={styles.filterOptions}>
//             {categories.map(category => (
//               <TouchableOpacity
//                 key={category}
//                 style={[styles.filterOption, filters.category === category && styles.selectedFilterOption]}
//                 onPress={() => {
//                   setFilters({
//                     ...filters,
//                     category: filters.category === category ? null : category,
//                     subcategory: null,
//                   });
//                   setCurrentPage(1);
//                 }}
//               >
//                 <Text style={styles.filterOptionText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {filters.category && (
//             <>
//               <Text style={styles.filterSectionTitle}>Subcategory</Text>
//               <View style={styles.filterOptions}>
//                 {subcategories[filters.category]?.map(subcategory => (
//                   <TouchableOpacity
//                     key={subcategory}
//                     style={[styles.filterOption, filters.subcategory === subcategory && styles.selectedFilterOption]}
//                     onPress={() => {
//                       setFilters({ ...filters, subcategory: filters.subcategory === subcategory ? null : subcategory });
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <Text style={styles.filterOptionText}>{subcategory}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </>
//           )}

//           <Text style={styles.filterSectionTitle}>Brand</Text>
//           <View style={styles.filterOptions}>
//             {brands.map(brand => (
//               <TouchableOpacity
//                 key={brand}
//                 style={[styles.filterOption, filters.brand === brand && styles.selectedFilterOption]}
//                 onPress={() => {
//                   setFilters({ ...filters, brand: filters.brand === brand ? null : brand });
//                   setCurrentPage(1);
//                 }}
//               >
//                 <Text style={styles.filterOptionText}>{brand}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.filterSectionTitle}>Price Range: ${filters.minPrice} - ${filters.maxPrice}</Text>
//           <Slider
//             style={{ width: '100%', height: 40 }}
//             minimumValue={0}
//             maximumValue={1000}
//             minimumTrackTintColor="#BB86FC"
//             maximumTrackTintColor="#FFFFFF"
//             thumbTintColor="#BB86FC"
//             value={filters.maxPrice}
//             onValueChange={(value) => {
//               setFilters({ ...filters, maxPrice: value });
//               setCurrentPage(1);
//             }}
//           />

//           <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
//           <View style={styles.ratingFilter}>
//             {ratings.map(rating => (
//               <TouchableOpacity
//                 key={rating}
//                 onPress={() => {
//                   setFilters({ ...filters, rating: filters.rating === rating ? null : rating });
//                   setCurrentPage(1);
//                 }}
//               >
//                 <FontAwesome
//                   name={filters.rating && rating <= filters.rating ? "star" : "star-o"}
//                   size={24}
//                   color={filters.rating && rating <= filters.rating ? "#FFD700" : "#fff"}
//                   style={styles.starIcon}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.filterSectionTitle}>Sort By</Text>
//           <View style={styles.filterOptions}>
//             <TouchableOpacity
//               style={[styles.filterOption, filters.sort === 'newest' && styles.selectedFilterOption]}
//               onPress={() => {
//                 setFilters({ ...filters, sort: 'newest' });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.filterOptionText}>Newest</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.filterOption, filters.sort === 'price-asc' && styles.selectedFilterOption]}
//               onPress={() => {
//                 setFilters({ ...filters, sort: 'price-asc' });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.filterOptionText}>Price: Low to High</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.filterOption, filters.sort === 'price-desc' && styles.selectedFilterOption]}
//               onPress={() => {
//                 setFilters({ ...filters, sort: 'price-desc' });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.filterOptionText}>Price: High to Low</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.filterOption, filters.sort === 'rating' && styles.selectedFilterOption]}
//               onPress={() => {
//                 setFilters({ ...filters, sort: 'rating' });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.filterOptionText}>Top Rated</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.toggleFilters}>
//             <TouchableOpacity
//               style={[styles.toggleFilter, filters.featured && styles.selectedToggleFilter]}
//               onPress={() => {
//                 setFilters({ ...filters, featured: !filters.featured });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.toggleFilterText}>Featured</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.toggleFilter, filters.newArrival && styles.selectedToggleFilter]}
//               onPress={() => {
//                 setFilters({ ...filters, newArrival: !filters.newArrival });
//                 setCurrentPage(1);
//               }}
//             >
//               <Text style={styles.toggleFilterText}>New Arrivals</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
//             <Text style={styles.resetButtonText}>Reset Filters</Text>
//           </TouchableOpacity>
//         </Animated.View>

//         {/* Promotional Banners */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Hot Deals 🔥</Text>
//           <FlatList
//             horizontal
//             data={promotionalBanners}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={[styles.bannerCard, { backgroundColor: item.color }]}>
//                 <Image source={{ uri: item.image }} style={styles.bannerImage} />
//                 <Text style={styles.bannerText}>{item.title}</Text>
//               </TouchableOpacity>
//             )}
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.bannerList}
//           />
//         </View>

//         {/* Categories Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Shop by Category</Text>
//           <FlatList
//             horizontal
//             data={categories}
//             keyExtractor={(item) => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.categoryCard}
//                 onPress={() => {
//                   setFilters({ ...filters, category: item, subcategory: null });
//                   setCurrentPage(1);
//                 }}
//               >
//                 <Text style={styles.categoryIcon}>{categoryIcons[item]}</Text>
//                 <Text style={styles.categoryText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
//               </TouchableOpacity>
//             )}
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoryList}
//           />
//         </View>

//         {/* Product Grid */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Our Products</Text>
//           <View style={styles.grid}>
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <View key={product._id} style={styles.card}>
//                   {product.featured && (
//                     <View style={styles.featuredBadge}>
//                       <Text style={styles.featuredBadgeText}>Featured</Text>
//                     </View>
//                   )}
//                   {product.newArrival && (
//                     <View style={styles.newBadge}>
//                       <Text style={styles.newBadgeText}>New</Text>
//                     </View>
//                   )}
//                   <TouchableOpacity onPress={() => navigation.navigate('profile-page/product-detail', { product })}>
//                     <Image source={{ uri: product.images[0] }} style={styles.image} />
//                   </TouchableOpacity>
//                   {product.salePrice && product.salePrice < product.price && (
//                     <Text style={styles.discount}>
//                       {calculateDiscountPercentage(product.price, product.salePrice)} OFF
//                     </Text>
//                   )}
//                   <View style={styles.ratingContainer}>
//                     <FontAwesome name="star" size={12} color="#FFD700" />
//                     <Text style={styles.ratingText}>{product.rating?.toFixed(1) || '0.0'}</Text>
//                     <Text style={styles.reviewsText}>({product.numReviews || 0})</Text>
//                   </View>
//                   <Text style={styles.name}>{product.name}</Text>
//                   <Text style={styles.brand}>{product.brand}</Text>
//                   <View style={styles.priceContainer}>
//                     <Text style={styles.price}>${product.salePrice?.toFixed(2) || product.price?.toFixed(2)}</Text>
//                     {product.salePrice && product.salePrice < product.price && (
//                       <Text style={styles.originalPrice}>${product.price?.toFixed(2)}</Text>
//                     )}
//                   </View>
//                   <TouchableOpacity
//                     style={styles.cartButton}
//                     onPress={() => handleAddToCart(product)}
//                   >
//                     <Ionicons name="cart-outline" size={20} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               ))
//             ) : (
//               <View style={styles.noResults}>
//                 <Text style={styles.noResultsText}>No products match your filters</Text>
//                 <TouchableOpacity onPress={resetFilters}>
//                   <Text style={styles.resetText}>Reset filters</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {/* Pagination Component */}
//           {totalPages > 1 && (
//             <View style={styles.paginationContainer}>
//               <TouchableOpacity
//                 style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
//                 onPress={goToPreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#9E9E9E" : "#FFFFFF"} />
//               </TouchableOpacity>
//               <View style={styles.pageNumbers}>
//                 {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//                   <TouchableOpacity
//                     key={page}
//                     style={[styles.pageNumber, currentPage === page && styles.activePageNumber]}
//                     onPress={() => goToPage(page)}
//                   >
//                     <Text style={[styles.pageNumberText, currentPage === page && styles.activePageNumberText]}>
//                       {page}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               <TouchableOpacity
//                 style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
//                 onPress={goToNextPage}
//                 disabled={currentPage === totalPages}
//               >
//                 <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#9E9E9E" : "#FFFFFF"} />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Footer Section */}
//         <View style={styles.footer}>
//           <Text style={styles.footerTitle}>Stay Connected</Text>
//           <Text style={styles.footerText}>Sign up for our newsletter to get the latest updates and exclusive offers!</Text>
//           <TouchableOpacity style={styles.footerButton}>
//             <Text style={styles.footerButtonText}>Subscribe Now</Text>
//           </TouchableOpacity>
//           <View style={styles.footerLinks}>
//             <TouchableOpacity>
//               <Text style={styles.footerLink}>About Us</Text>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.footerLink}>Contact</Text>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.footerLink}>FAQs</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.footerCopyright}>© 2025 Fashion Store. All rights reserved.</Text>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100%',
//     width: '100%',
//   },
//   lottie: {
//     width: 200,
//     height: 200,
//   },
//   heroSection: {
//     borderRadius: 16,
//     marginBottom: 16,
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heroOverlay: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 16,
//     padding: 20,
//     alignItems: 'center',
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//   },
//   heroTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: '#FFD700',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   heroButton: {
//     backgroundColor: '#03DAC6',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 24,
//   },
//   heroButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     marginBottom: 16,
//     backgroundColor: 'rgba(30, 30, 30, 0.9)',
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   iconButton: {
//     padding: 8,
//     backgroundColor: '#333',
//     borderRadius: 50,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#BB86FC',
//     marginBottom: 12,
//   },
//   bannerList: {
//     paddingHorizontal: 4,
//   },
//   bannerCard: {
//     width: 250,
//     height: 120,
//     borderRadius: 12,
//     marginRight: 12,
//     overflow: 'hidden',
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bannerImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     opacity: 0.7,
//   },
//   bannerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     paddingHorizontal: 16,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   categoryList: {
//     paddingHorizontal: 4,
//   },
//   categoryCard: {
//     width: 80,
//     height: 100,
//     borderRadius: 12,
//     backgroundColor: '#2C2C2C',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     shadowColor: '#BB86FC',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   categoryIcon: {
//     fontSize: 30,
//     marginBottom: 8,
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingBottom: 20,
//   },
//   card: {
//     width: '48%',
//     backgroundColor: '#1E1E1E',
//     padding: 10,
//     marginBottom: 16,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//     position: 'relative',
//   },
//   image: {
//     width: '100%',
//     height: 150,
//     resizeMode: 'cover',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   discount: {
//     backgroundColor: '#BB86FC',
//     color: '#000',
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     fontSize: 12,
//     fontWeight: 'bold',
//     position: 'absolute',
//     top: 18,
//     left: 18,
//     borderRadius: 4,
//   },
//   featuredBadge: {
//     backgroundColor: '#FF0266',
//     position: 'absolute',
//     top: 18,
//     right: 18,
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//     zIndex: 1,
//   },
//   featuredBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   newBadge: {
//     backgroundColor: '#03DAC6',
//     position: 'absolute',
//     top: 18,
//     right: 18,
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//     zIndex: 1,
//   },
//   newBadgeText: {
//     color: '#000',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   ratingText: {
//     color: '#FFD700',
//     fontSize: 12,
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
//   reviewsText: {
//     color: '#9E9E9E',
//     fontSize: 10,
//     marginLeft: 4,
//   },
//   name: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fff',
//     marginBottom: 2,
//   },
//   brand: {
//     fontSize: 12,
//     color: '#BB86FC',
//     marginBottom: 4,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   price: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#03DAC6',
//     marginRight: 8,
//   },
//   originalPrice: {
//     fontSize: 12,
//     color: '#9E9E9E',
//     textDecorationLine: 'line-through',
//   },
//   cartButton: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//     backgroundColor: '#BB86FC',
//     padding: 6,
//     borderRadius: 20,
//   },
//   cartIconContainer: {
//     position: 'relative',
//     padding: 8,
//     backgroundColor: '#3700B3',
//     borderRadius: 50,
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: '#FF0266',
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   filterContainer: {
//     backgroundColor: '#1E1E1E',
//     padding: 16,
//     borderRadius: 10,
//     margin: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   filterTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   filterSectionTitle: {
//     color: '#BB86FC',
//     fontSize: 14,
//     fontWeight: '600',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   filterOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 8,
//   },
//   filterOption: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     backgroundColor: '#333',
//   },
//   selectedFilterOption: {
//     backgroundColor: '#BB86FC',
//   },
//   filterOptionText: {
//     color: '#fff',
//     fontSize: 12,
//   },
//   ratingFilter: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   starIcon: {
//     marginRight: 4,
//   },
//   toggleFilters: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   toggleFilter: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#BB86FC',
//   },
//   selectedToggleFilter: {
//     backgroundColor: '#BB86FC',
//   },
//   toggleFilterText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   resetButton: {
//     backgroundColor: '#FF0266',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   resetButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   noResults: {
//     width: '100%',
//     alignItems: 'center',
//     padding: 20,
//   },
//   noResultsText: {
//     color: '#fff',
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   resetText: {
//     color: '#BB86FC',
//     textDecorationLine: 'underline',
//   },
//   footer: {
//     backgroundColor: '#1E1E1E',
//     padding: 20,
//     marginBottom: 130,
//     borderRadius: 16,
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   footerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#BB86FC',
//     marginBottom: 8,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#CCCCCC',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   footerButton: {
//     backgroundColor: '#FFD700',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 24,
//     marginBottom: 16,
//   },
//   footerButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   footerLinks: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 16,
//   },
//   footerLink: {
//     fontSize: 14,
//     color: '#BB86FC',
//     textDecorationLine: 'underline',
//   },
//   footerCopyright: {
//     fontSize: 12,
//     color: '#AAAAAA',
//   },
//   paginationContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   paginationButton: {
//     padding: 10,
//     backgroundColor: '#333',
//     borderRadius: 50,
//     marginHorizontal: 8,
//   },
//   disabledButton: {
//     backgroundColor: '#2C2C2C',
//   },
//   pageNumbers: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   pageNumber: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     backgroundColor: '#333',
//   },
//   activePageNumber: {
//     backgroundColor: '#BB86FC',
//   },
//   pageNumberText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   activePageNumberText: {
//     color: '#000000',
//   },
// });



import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ToastAndroid, FlatList, Animated, ActivityIndicator, RefreshControl } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function FashionShopScreen() {
  const { cartProducts, setCartProducts } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState({
    keyword: '',
    category: null,
    subcategory: null,
    brand: null,
    minPrice: 0,
    maxPrice: 1000,
    rating: null,
    featured: false,
    newArrival: false,
    sort: 'newest',
  });

  const filterAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Puma', 'Levi\'s'];
  const categories = ['men', 'women', 'kids', 'accessories'];
  const subcategories = {
    men: ['T-Shirts', 'Jeans', 'Shirts', 'Jackets', 'Shoes'],
    women: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Shoes'],
    kids: ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Shoes'],
    accessories: ['Watches', 'Bags', 'Jewelry', 'Hats', 'Sunglasses'],
  };
  const ratings = [1, 2, 3, 4, 5];

  useEffect(() => {
    Animated.timing(filterAnimation, {
      toValue: showFilters ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showFilters]);

  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const params = {
        ...filters
      };

      // Clean up params - remove null/empty values
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '' || params[key] === false) {
          delete params[key];
        }
      });

      const response = await axios.get('https://fashionista-red.vercel.app/api/products', {
        params,
        timeout: 5000,
      });

      setProducts(response.data.products);
      setCount(response.data.count);
    } catch (error) {
      console.error('Error fetching products:', error);
      ToastAndroid.show('Failed to fetch products. Please check your connection.', ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters.keyword, filters.category, filters.subcategory, filters.brand, filters.minPrice, filters.maxPrice, filters.rating, filters.featured, filters.newArrival, filters.sort]);

  useEffect(() => {
    const fetchTimer = setTimeout(() => {
      fetchProducts();
    }, 300); // Add slight debounce for filter changes

    return () => clearTimeout(fetchTimer);
  }, [fetchProducts]);

  const filterOpacity = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const filterTranslateY = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const handleAddToCart = (product) => {
    const cartItemId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const existingProductIndex = cartProducts.findIndex(
      (item) =>
        item._id === product._id &&
        item.selectedSize === product.sizes[0].size &&
        item.selectedColor === product.colors[0].color
    );
    if (existingProductIndex === -1) {
      setCartProducts((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
          selectedSize: product.sizes[0].size,
          selectedColor: product.colors[0].color,
          cartItemId,
          image: product.images[0],
        },
      ]);
    } else {
      const updatedCart = [...cartProducts];
      updatedCart[existingProductIndex].quantity += 1;
      setCartProducts(updatedCart);
    }
    ToastAndroid.show('Added to cart successfully!', ToastAndroid.SHORT);
  };

  const calculateDiscountPercentage = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return '';
    return Math.round(((price - salePrice) / price) * 100) + '%';
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      category: null,
      subcategory: null,
      brand: null,
      minPrice: 0,
      maxPrice: 1000,
      rating: null,
      featured: false,
      newArrival: false,
      sort: 'newest',
    });
  };

  const promotionalBanners = [
    { id: '1', title: 'Summer Sale Up to 50% Off!', color: '#FF6B81', image: 'https://img.freepik.com/free-photo/summer-sale_53876-138860.jpg' },
    { id: '2', title: 'New Arrivals in Accessories!', color: '#03DAC6', image: 'https://img.freepik.com/free-photo/accessories_53876-138861.jpg' },
    { id: '3', title: 'Free Shipping on Orders Over $200!', color: '#FFD700', image: 'https://img.freepik.com/free-photo/free-shipping_53876-138862.jpg' },
  ];

  const categoryIcons = {
    men: '👕',
    women: '👗',
    kids: '👶',
    accessories: '👜',
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#121212", "#1E1E1E", "#252525"]}
        style={[styles.container, styles.loadingContainer]}
      >
        <LottieView
          source={{ uri: 'https://lottie.host/cd4d1dff-256b-461b-8b32-0cd291ff2e26/UZnRwRqeiq.lottie' }}
          autoPlay
          loop
          style={styles.lottie}
        />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#121212", "#1E1E1E", "#252525"]} style={{ flex: 1, paddingTop: 35 }}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchProducts(true)}
            colors={['#BB86FC']}
            tintColor="#BB86FC"
          />
        }
      >
        {/* Hero Section */}
        <LinearGradient colors={['#BB86FC', '#FF6B81']} style={styles.heroSection}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Discover the Latest Fashion Trends</Text>
            <Text style={styles.heroSubtitle}>Shop Now and Save Big on Your Favorites!</Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate('profile-page/product-detail', { product: products[0] })}>
              <Text style={styles.heroButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Enhanced Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Fashion Store</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              onPress={() => fetchProducts(true)} 
              style={styles.iconButton}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="refresh-outline" size={24} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.iconButton}>
              <MaterialIcons name="filter-list" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate('profile-page/cart')}>
              <Ionicons name="cart-outline" size={24} color="white" />
              {cartProducts.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartProducts.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters Section with Animation */}
        <Animated.View
          style={[
            styles.filterContainer,
            {
              opacity: filterOpacity,
              transform: [{ translateY: filterTranslateY }],
              display: showFilters ? 'flex' : 'none',
            },
          ]}
        >
          <Text style={styles.filterTitle}>Filters</Text>

          <Text style={styles.filterSectionTitle}>Keyword</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#9E9E9E"
              value={filters.keyword}
              onChangeText={(text) => setFilters({ ...filters, keyword: text })}
            />
          </View>

          <Text style={styles.filterSectionTitle}>Category</Text>
          <View style={styles.filterOptions}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.filterOption, filters.category === category && styles.selectedFilterOption]}
                onPress={() => {
                  setFilters({
                    ...filters,
                    category: filters.category === category ? null : category,
                    subcategory: null,
                  });
                }}
              >
                <Text style={styles.filterOptionText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {filters.category && (
            <>
              <Text style={styles.filterSectionTitle}>Subcategory</Text>
              <View style={styles.filterOptions}>
                {subcategories[filters.category]?.map(subcategory => (
                  <TouchableOpacity
                    key={subcategory}
                    style={[styles.filterOption, filters.subcategory === subcategory && styles.selectedFilterOption]}
                    onPress={() => {
                      setFilters({ ...filters, subcategory: filters.subcategory === subcategory ? null : subcategory });
                    }}
                  >
                    <Text style={styles.filterOptionText}>{subcategory}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={styles.filterSectionTitle}>Brand</Text>
          <View style={styles.filterOptions}>
            {brands.map(brand => (
              <TouchableOpacity
                key={brand}
                style={[styles.filterOption, filters.brand === brand && styles.selectedFilterOption]}
                onPress={() => {
                  setFilters({ ...filters, brand: filters.brand === brand ? null : brand });
                }}
              >
                <Text style={styles.filterOptionText}>{brand}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterSectionTitle}>Price Range: ${filters.minPrice} - ${filters.maxPrice}</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={1000}
            minimumTrackTintColor="#BB86FC"
            maximumTrackTintColor="#FFFFFF"
            thumbTintColor="#BB86FC"
            value={filters.maxPrice}
            onValueChange={(value) => {
              setFilters({ ...filters, maxPrice: value });
            }}
          />

          <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
          <View style={styles.ratingFilter}>
            {ratings.map(rating => (
              <TouchableOpacity
                key={rating}
                onPress={() => {
                  setFilters({ ...filters, rating: filters.rating === rating ? null : rating });
                }}
              >
                <FontAwesome
                  name={filters.rating && rating <= filters.rating ? "star" : "star-o"}
                  size={24}
                  color={filters.rating && rating <= filters.rating ? "#FFD700" : "#fff"}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterSectionTitle}>Sort By</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, filters.sort === 'newest' && styles.selectedFilterOption]}
              onPress={() => {
                setFilters({ ...filters, sort: 'newest' });
              }}
            >
              <Text style={styles.filterOptionText}>Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, filters.sort === 'price-asc' && styles.selectedFilterOption]}
              onPress={() => {
                setFilters({ ...filters, sort: 'price-asc' });
              }}
            >
              <Text style={styles.filterOptionText}>Price: Low to High</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, filters.sort === 'price-desc' && styles.selectedFilterOption]}
              onPress={() => {
                setFilters({ ...filters, sort: 'price-desc' });
              }}
            >
              <Text style={styles.filterOptionText}>Price: High to Low</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, filters.sort === 'rating' && styles.selectedFilterOption]}
              onPress={() => {
                setFilters({ ...filters, sort: 'rating' });
              }}
            >
              <Text style={styles.filterOptionText}>Top Rated</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toggleFilters}>
            <TouchableOpacity
              style={[styles.toggleFilter, filters.featured && styles.selectedToggleFilter]}
              onPress={() => {
                setFilters({ ...filters, featured: !filters.featured });
              }}
            >
              <Text style={styles.toggleFilterText}>Featured</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleFilter, filters.newArrival && styles.selectedToggleFilter]}
              onPress={() => {
                setFilters({ ...filters, newArrival: !filters.newArrival });
              }}
            >
              <Text style={styles.toggleFilterText}>New Arrivals</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Promotional Banners */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hot Deals 🔥</Text>
          <FlatList
            horizontal
            data={promotionalBanners}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.bannerCard, { backgroundColor: item.color }]}>
                <Image source={{ uri: item.image }} style={styles.bannerImage} />
                <Text style={styles.bannerText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannerList}
          />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                  setFilters({ ...filters, category: item, subcategory: null });
                }}
              >
                <Text style={styles.categoryIcon}>{categoryIcons[item]}</Text>
                <Text style={styles.categoryText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Product Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Products</Text>
          <View style={styles.grid}>
            {products.length > 0 ? (
              products.map((product) => (
                <View key={product._id} style={styles.card}>
                  {product.featured && (
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeText}>Featured</Text>
                    </View>
                  )}
                  {product.newArrival && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>New</Text>
                    </View>
                  )}
                  <TouchableOpacity onPress={() => navigation.navigate('profile-page/product-detail', { product })}>
                    <Image source={{ uri: product.images[0] }} style={styles.image} />
                  </TouchableOpacity>
                  {product.salePrice && product.salePrice < product.price && (
                    <Text style={styles.discount}>
                      {calculateDiscountPercentage(product.price, product.salePrice)} OFF
                    </Text>
                  )}
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{product.rating?.toFixed(1) || '0.0'}</Text>
                    <Text style={styles.reviewsText}>({product.numReviews || 0})</Text>
                  </View>
                  <Text style={styles.name}>{product.name}</Text>
                  <Text style={styles.brand}>{product.brand}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${product.salePrice?.toFixed(2) || product.price?.toFixed(2)}</Text>
                    {product.salePrice && product.salePrice < product.price && (
                      <Text style={styles.originalPrice}>${product.price?.toFixed(2)}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => handleAddToCart(product)}
                  >
                    <Ionicons name="cart-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No products match your filters</Text>
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.resetText}>Reset filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Stay Connected</Text>
          <Text style={styles.footerText}>Sign up for our newsletter to get the latest updates and exclusive offers!</Text>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>FAQs</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerCopyright}>© 2025 Fashion Store. All rights reserved.</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  heroSection: {
    borderRadius: 16,
    marginBottom: 16,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#03DAC6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#BB86FC',
    marginBottom: 12,
  },
  bannerList: {
    paddingHorizontal: 4,
  },
  bannerCard: {
    width: 250,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.7,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoryList: {
    paddingHorizontal: 4,
  },
  categoryCard: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  card: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    padding: 10,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  discount: {
    backgroundColor: '#BB86FC',
    color: '#000',
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute',
    top: 18,
    left: 18,
    borderRadius: 4,
  },
  featuredBadge: {
    backgroundColor: '#FF0266',
    position: 'absolute',
    top: 18,
    right: 18,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    zIndex: 1,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: '#03DAC6',
    position: 'absolute',
    top: 18,
    right: 18,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    zIndex: 1,
  },
  newBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  reviewsText: {
    color: '#9E9E9E',
    fontSize: 10,
    marginLeft: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  brand: {
    fontSize: 12,
    color: '#BB86FC',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#03DAC6',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
  },
  cartButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#BB86FC',
    padding: 6,
    borderRadius: 20,
  },
  cartIconContainer: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#3700B3',
    borderRadius: 50,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF0266',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterContainer: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 10,
    margin: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterSectionTitle: {
    color: '#BB86FC',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#333',
  },
  selectedFilterOption: {
    backgroundColor: '#BB86FC',
  },
  filterOptionText: {
    color: '#fff',
    fontSize: 12,
  },
  ratingFilter: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starIcon: {
    marginRight: 4,
  },
  toggleFilters: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  toggleFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BB86FC',
  },
  selectedToggleFilter: {
    backgroundColor: '#BB86FC',
  },
  toggleFilterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF0266',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResults: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  resetText: {
    color: '#BB86FC',
    textDecorationLine: 'underline',
  },
  footer: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    marginBottom: 130,
    borderRadius: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BB86FC',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 16,
  },
  footerButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 16,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: '#BB86FC',
    textDecorationLine: 'underline',
  },
  footerCopyright: {
    fontSize: 12,
    color: '#AAAAAA',
  },
});