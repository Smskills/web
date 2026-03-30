import express from 'express';
import { ConfigController } from '../controllers/config.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publicly readable so visitors see the correct branding
router.get('/', ConfigController.getConfig);

// Protected: Only logged-in admins can overwrite the site config
router.post('/', authMiddleware, ConfigController.updateConfig);

export default router;
