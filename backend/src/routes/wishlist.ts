import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  removeWishlistProduct,
} from '../controllers/wishlistController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { z } from 'zod';

const router = Router();

const addItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
});

router.get('/', getWishlist);
router.post('/items', validateBody(addItemSchema), addToWishlist);
router.delete('/items/:itemId', removeWishlistItem);
router.delete('/products/:productId', removeWishlistProduct);

export default router;
