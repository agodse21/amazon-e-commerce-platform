import { Router } from 'express';
import { listProducts, getProduct } from '../controllers/productController.js';
import { validateQuery } from '../middleware/validateRequest.js';
import { z } from 'zod';

const router = Router();

const productQuerySchema = z.object({
  search: z.string().max(200).optional(),
  categoryId: z.string().regex(/^\d+$/).optional(),
  cursor: z.string().uuid().optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v), 50) : 20)),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
});

router.get('/', validateQuery(productQuerySchema), listProducts);
router.get('/:id', getProduct);

export default router;
