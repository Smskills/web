
import express from 'express';
import courseRoutes from './courses.routes.js';
import authRoutes from './auth.routes.js';
import leadsRoutes from './leads.routes.js';
import configRoutes from './config.routes.js';

const router = express.Router();

/**
 * Institutional Backend Health Gateway
 */
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    version: '1.2.0'
  });
});

/**
 * Core Institutional Modules
 */
router.use('/auth', authRoutes);
router.use('/config', configRoutes);
router.use('/courses', courseRoutes);
router.use('/leads', leadsRoutes);

export default router;
