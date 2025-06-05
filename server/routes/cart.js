import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Cart is managed client-side, this route exists for potential future server-side cart management
router.get('/', protect, (req, res) => {
  res.json({ message: 'Cart is managed client-side' });
});

export default router;