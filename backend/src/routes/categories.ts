import { Router } from 'express';
import { listCategories } from '../controllers/productController';

const router = Router();

router.get('/', listCategories);

export default router;
