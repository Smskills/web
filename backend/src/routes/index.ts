import { Router } from 'express';
import configRoutes from './config.routes.ts';
import leadsRoutes from './leads.routes.ts';
import authRoutes from './auth.routes.ts';
import coursesRoutes from './courses.routes.ts';
import { createGenericRouter } from './generic.routes.ts';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'SM Skills API is running',
    version: '1.0.0'
  });
});

router.use('/config', configRoutes);
router.use('/leads', leadsRoutes);
router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/users', createGenericRouter('users', true));

// Generic Routes (Public Read, Protected Write)
router.use('/notices', createGenericRouter('notices', false));
router.use('/gallery', createGenericRouter('gallery', false));
router.use('/faqs', createGenericRouter('faqs', false));
router.use('/custom-pages', createGenericRouter('custom_pages', false));
router.use('/placement-stats', createGenericRouter('placement_stats', false));
router.use('/student-reviews', createGenericRouter('student_reviews', false));
router.use('/industry-partners', createGenericRouter('industry_partners', false));
router.use('/career-services', createGenericRouter('career_services', false));
router.use('/team-members', createGenericRouter('team_members', false));
router.use('/achievement-stats', createGenericRouter('achievement_stats', false));
router.use('/extra-chapters', createGenericRouter('extra_chapters', false));
router.use('/legal-sections', createGenericRouter('legal_sections', false));

// Catch-all for unmatched API routes
router.all('*', (req, res) => {
  res.status(404).json({
    status: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

export default router;
