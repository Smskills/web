export {};

declare global {
  namespace Express {
    interface Request {
      user?: any; // To be populated by authMiddleware
    }
  }

  interface APIResponse {
    success: boolean;
    message: string;
    data?: any;
    timestamp: string;
  }
}