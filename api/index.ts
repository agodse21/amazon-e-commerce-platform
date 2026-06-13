/**
 * Vercel Serverless Function — Global API Entry Point
 *
 * All requests to /api/* are routed here via vercel.json rewrites.
 * This single file imports the Express app from backend/src/app.ts
 * and re-exports it as the Vercel serverless handler.
 *
 * Vercel's Node.js runtime accepts an Express app as a default export
 * and uses its (req, res) signature as the serverless handler.
 */
export { default } from '../backend/src/app.js';
