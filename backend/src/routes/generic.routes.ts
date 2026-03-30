import { Router } from 'express';
import { GenericController } from '../controllers/generic.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

export const createGenericRouter = (table: string, protectAll = true) => {
  const router = Router();
  const controller = new GenericController(table);

  if (protectAll) {
    router.use(authMiddleware);
  }

  router.get('/', controller.getAll);
  router.get('/:id', controller.getOne);
  
  // If not protecting all, we might still want to protect write operations
  if (!protectAll) {
    router.post('/', authMiddleware, controller.create);
    router.put('/:id', authMiddleware, controller.update);
    router.delete('/:id', authMiddleware, controller.delete);
  } else {
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);
  }

  return router;
};
