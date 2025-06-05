import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getSellerOrders,
  createPayment,
  verifyPayment,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/seller', protect, authorize('seller'), getSellerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, verifyPayment);
router.put('/:id/status', protect, authorize('seller'), updateOrderStatus);
router.post('/create-payment', protect, createPayment);

export default router;