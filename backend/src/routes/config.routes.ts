
import express from 'express';
import { ConfigController } from '../controllers/config.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.get('/', ConfigController.getConfig);
router.post('/', authMiddleware, ConfigController.updateConfig);

export default router;
