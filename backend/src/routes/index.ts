import { Router } from 'express';
import courseRoutes from './courses.routes';
import authRoutes from './auth.routes';

const router = Router();

/**
 * Institutional Backend Health Gateway
 */
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Core Institutional Modules
 */
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);

export default router;