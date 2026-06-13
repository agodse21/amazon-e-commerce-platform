import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/orderService';
import { sendSuccess, sendCreated } from '../utils/response';
import { ShippingAddress } from '../services/orderService';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { shippingAddress, items } = req.body as {
      shippingAddress: ShippingAddress;
      items?: orderService.OrderLineItem[];
    };
    const order = await orderService.createOrder(req.sessionId, shippingAddress, items);
    sendCreated(res, order, 'Order placed successfully');
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id, req.sessionId);
    sendSuccess(res, order);
  } catch (err) {
    next(err);
  }
};

export const listOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await orderService.getOrdersBySession(req.sessionId);
    sendSuccess(res, orders);
  } catch (err) {
    next(err);
  }
};
