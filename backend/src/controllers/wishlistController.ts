import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlistService.js';
import { sendSuccess } from '../utils/response.js';

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await wishlistService.getWishlist(req.sessionId);
    sendSuccess(res, { items });
  } catch (err) {
    next(err);
  }
};

export const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.body as { productId: string };
    const items = await wishlistService.addToWishlist(req.sessionId, productId);
    sendSuccess(res, { items }, 200, 'Added to wishlist');
  } catch (err) {
    next(err);
  }
};

export const removeWishlistItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const items = await wishlistService.removeFromWishlist(req.sessionId, itemId);
    sendSuccess(res, { items }, 200, 'Removed from wishlist');
  } catch (err) {
    next(err);
  }
};

export const removeWishlistProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const items = await wishlistService.removeProductFromWishlist(req.sessionId, productId);
    sendSuccess(res, { items }, 200, 'Removed from wishlist');
  } catch (err) {
    next(err);
  }
};
