import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { z } from 'zod';

const router = Router();

const addItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1).max(99),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

router.get('/', getCart);
router.post('/items', validateBody(addItemSchema), addToCart);
router.put('/items/:itemId', validateBody(updateItemSchema), updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.delete('/', clearCart);

export default router;
