import { Router } from 'express';
import { CoursesController } from '../controllers/courses.controller';

const router = Router();

router.get('/', CoursesController.getCourses);
router.get('/:id', CoursesController.getCourseById);

export default router;