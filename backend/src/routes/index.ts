
import { Router } from 'express';
import courseRoutes from './courses.routes';
import authRoutes from './auth.routes';
import leadsRoutes from './leads.routes';

const router = Router();

/**
 * Institutional Backend Health Gateway
 */
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    version: '1.1.0'
  });
});

/**
 * Core Institutional Modules
 */
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/leads', leadsRoutes);

export default router;
