import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';
import { sendResponse } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[API Error] ${statusCode} - ${message}`);
  
  if (ENV.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  return sendResponse(res, statusCode, false, message, 
    ENV.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};