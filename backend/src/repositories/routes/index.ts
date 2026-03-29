
import express from 'express';
import courseRoutes from './courses.routes';
import authRoutes from './auth.routes';
import leadsRoutes from './leads.routes';
import configRoutes from './config.routes';

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
const authMiddlewareRouter = (authRoutes as any).default || authRoutes;
if (authMiddlewareRouter) router.use('/auth', authMiddlewareRouter);

const configMiddlewareRouter = (configRoutes as any).default || configRoutes;
if (configMiddlewareRouter) router.use('/config', configMiddlewareRouter);

const courseMiddlewareRouter = (courseRoutes as any).default || courseRoutes;
if (courseMiddlewareRouter) router.use('/courses', courseMiddlewareRouter);

const leadsMiddlewareRouter = (leadsRoutes as any).default || leadsRoutes;
if (leadsMiddlewareRouter) router.use('/leads', leadsMiddlewareRouter);

export default router;
