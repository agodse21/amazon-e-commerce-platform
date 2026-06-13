import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';
import { sendSuccess } from '../utils/response';

export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await cartService.getCart(req.sessionId);
    sendSuccess(res, cart);
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity } = req.body as { productId: string; quantity: number };
    const cart = await cartService.addToCart(req.sessionId, productId, quantity);
    sendSuccess(res, cart, 200, 'Item added to cart');
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body as { quantity: number };
    const cart = await cartService.updateCartItem(req.sessionId, itemId, quantity);
    sendSuccess(res, cart, 200, 'Cart updated');
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const cart = await cartService.removeCartItem(req.sessionId, itemId);
    sendSuccess(res, cart, 200, 'Item removed');
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await cartService.clearCart(req.sessionId);
    sendSuccess(res, null, 200, 'Cart cleared');
  } catch (err) {
    next(err);
  }
};
