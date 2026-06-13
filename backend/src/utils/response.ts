import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string
): Response => {
  const response: ApiResponse<T> = { success: true, data };
  if (message) response.message = message;
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: string
): Response => {
  const response: ApiResponse = { success: false, message };
  if (error && process.env.NODE_ENV === 'development') response.error = error;
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message?: string): Response =>
  sendSuccess(res, data, 201, message);

export const sendNotFound = (res: Response, resource = 'Resource'): Response =>
  sendError(res, `${resource} not found`, 404);

export const sendBadRequest = (res: Response, message: string): Response =>
  sendError(res, message, 400);

export const sendUnauthorized = (res: Response, message = 'Unauthorized'): Response =>
  sendError(res, message, 401);
