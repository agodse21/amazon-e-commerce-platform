import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';
import { sendSuccess, sendNotFound } from '../utils/response';

export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      search,
      categoryId,
      cursor,
      limit = '20',
      sortBy,
    } = req.query as Record<string, string>;

    const result = await productService.getProducts({
      search,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      cursor,
      limit: Math.min(parseInt(limit) || 20, 50),
      sortBy: sortBy as 'price_asc' | 'price_desc' | 'rating' | 'newest',
    });

    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      sendNotFound(res, 'Product');
      return;
    }

    sendSuccess(res, product);
  } catch (err) {
    next(err);
  }
};

export const listCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await productService.getAllCategories();
    sendSuccess(res, categories);
  } catch (err) {
    next(err);
  }
};
