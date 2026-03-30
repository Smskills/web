
import express from 'express';
import { LeadsController } from '../controllers/leads.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.post('/', LeadsController.createLead);
router.get('/', authMiddleware, LeadsController.getLeads);

export default router;
