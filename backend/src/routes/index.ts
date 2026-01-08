import { Router } from 'express';

const router = Router();

// Health Check
// Fix: Corrected parameter name from 'resentment' to 'res' to match its usage in the function body
router.get('/health', (req, res, next) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Placeholder for feature routes (to be implemented in next steps)
// router.use('/site', siteRoutes);
// router.use('/courses', courseRoutes);

export default router;