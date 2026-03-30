
import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.ts';
import { sendResponse } from '../utils/response.ts';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err.message || err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return sendResponse(res, statusCode, false, message, ENV.NODE_ENV === 'development' ? err.stack : null);
};
