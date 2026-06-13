import { Router } from 'express';
import { createOrder, getOrder, listOrders } from '../controllers/orderController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { z } from 'zod';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const shippingAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  street: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zip: z.string().min(3).max(20),
  country: z.string().min(2).max(100),
  phone: z.string().max(20).optional(),
});

const orderLineItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z.array(orderLineItemSchema).min(1).max(10).optional(),
});

router.get('/', listOrders);
router.get('/:id', getOrder);
router.post('/', orderLimiter, validateBody(createOrderSchema), createOrder);

export default router;
