import { Router } from 'express';
// Use global process instead of explicit import to avoid type conflicts with NodeJS.Process
import courseRoutes from './courses.routes.ts';

const router = Router();

/**
 * API Root / Health Check
 */
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    // Accessing uptime from the global process object to fix "Property 'uptime' does not exist" error
    uptime: process.uptime()
  });
});

/**
 * Module Route Registration
 */
router.use('/courses', courseRoutes);

// Modular placeholders for upcoming logic:
// router.use('/admin', adminRoutes);
// router.use('/forms', formRoutes);
// router.use('/site', siteRoutes);

export default router;