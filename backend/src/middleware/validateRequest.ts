import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };

export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors,
      });
      return;
    }
    req.query = result.data;
    next();
  };

const formatZodErrors = (error: ZodError): Record<string, string> => {
  return error.errors.reduce(
    (acc, err) => {
      const path = err.path.join('.');
      acc[path || 'value'] = err.message;
      return acc;
    },
    {} as Record<string, string>
  );
};
