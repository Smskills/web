
import express from 'express';
import { CoursesController } from '../controllers/courses.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.get('/', CoursesController.getCourses);
router.post('/', authMiddleware, CoursesController.createCourse);
router.put('/:id', authMiddleware, CoursesController.updateCourse);
router.delete('/:id', authMiddleware, CoursesController.deleteCourse);

export default router;
