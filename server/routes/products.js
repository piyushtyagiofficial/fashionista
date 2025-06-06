import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getSellerProducts,
  updateProductStock,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/', protect, authorize('seller'), createProduct);
router.put('/:id', protect, authorize('seller'), updateProduct);
router.put('/:id/stock', protect, updateProductStock);
router.delete('/:id', protect, authorize('seller'), deleteProduct);
router.post('/:id/reviews', protect, createProductReview);
router.get('/seller/products', protect, authorize('seller'), getSellerProducts);

export default router;