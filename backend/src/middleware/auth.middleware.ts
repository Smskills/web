
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.ts';
import { sendResponse } from '../utils/response.ts';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, 'Unauthorized: No token provided');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return sendResponse(res, 401, false, 'Unauthorized: Invalid token');
  }
};
