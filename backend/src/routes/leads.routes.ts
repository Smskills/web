
import express from 'express';
import { LeadsController } from '../controllers/leads.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.post('/', LeadsController.createLead);
router.get('/', authMiddleware, LeadsController.getLeads);
router.patch('/:id/status', authMiddleware, LeadsController.updateLeadStatus);
router.delete('/:id', authMiddleware, LeadsController.deleteLead);

export default router;
