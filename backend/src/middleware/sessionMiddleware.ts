import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'amazon_session_id';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 year

// Attach session ID to every request — creates one if absent
export const sessionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  let sessionId = req.cookies?.[SESSION_COOKIE] as string | undefined;

  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  }

  req.sessionId = sessionId;
  next();
};
