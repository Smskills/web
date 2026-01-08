import { Router } from 'express';
import courseRoutes from './courses.routes';

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
 * Feature Module Registration
 */
router.use('/courses', courseRoutes);

// Stubs for forthcoming modules:
// router.use('/admin', adminRoutes);
// router.use('/forms', formsRoutes);
// router.use('/site', siteRoutes);

export default router;