import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const subcategory = req.query.subcategory ? { subcategory: req.query.subcategory } : {};
    const brand = req.query.brand ? { brand: req.query.brand } : {};
    const featured = req.query.isFeatured ? { featured: true } : {};
    const newArrival = req.query.isNew ? { newArrival: true } : {};

    // Price filter
    const priceFilter = {};
    if (req.query.minPrice && req.query.maxPrice) {
      priceFilter.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      };
    } else if (req.query.minPrice) {
      priceFilter.price = { $gte: Number(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      priceFilter.price = { $lte: Number(req.query.maxPrice) };
    }

    // Combine all filters
    const filters = {
      ...keyword,
      ...category,
      ...subcategory,
      ...brand,
      ...featured,
      ...newArrival,
      ...priceFilter,
    };

    // Sort options
    let sortOption = {};
    if (req.query.sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (req.query.sort === 'rating') {
      sortOption = { rating: -1 };
    } else {
      // Default sort by newest
      sortOption = { createdAt: -1 };
    }

    const count = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('seller', '_id')
      .lean()
      .exec();

    if (!products) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products',
      error: error.message 
    });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      subcategory,
      description,
      price,
      salePrice,
      images,
      sizes,
      colors,
      featured,
    } = req.body;

    const product = new Product({
      seller: req.user._id,
      name,
      brand,
      category,
      subcategory,
      description,
      price,
      salePrice: salePrice || 0,
      images,
      sizes,
      colors,
      featured: featured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      subcategory,
      description,
      price,
      salePrice,
      images,
      sizes,
      colors,
      featured,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the user is the seller of the product
      if (product.seller.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this product');
      }

      product.name = name || product.name;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.subcategory = subcategory || product.subcategory;
      product.description = description || product.description;
      product.price = price || product.price;
      product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;
      product.images = images || product.images;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.featured = featured !== undefined ? featured : product.featured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the user is the seller of the product
      if (product.seller.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this product');
      }

      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user already reviewed
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get products by seller
// @route   GET /api/products/seller
// @access  Private/Seller
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};