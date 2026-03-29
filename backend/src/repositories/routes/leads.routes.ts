import express from 'express';
import { LeadsController } from '../controllers/leads.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

/**
 * Public: Submit a new enquiry or enrollment
 */
router.post('/', LeadsController.createLead);

/**
 * Protected: Manage leads from dashboard
 */
router.get('/', authMiddleware, LeadsController.getAllLeads);
router.patch('/:id/status', authMiddleware, LeadsController.updateLeadStatus);
router.delete('/:id', authMiddleware, LeadsController.deleteLead);

export default router;
