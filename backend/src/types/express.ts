/* eslint-disable @typescript-eslint/no-namespace -- Express global augmentation requires namespace */
declare global {
  namespace Express {
    interface Request {
      sessionId: string;
    }
  }
}

export {};
