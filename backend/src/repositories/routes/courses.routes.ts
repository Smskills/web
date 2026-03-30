import express from 'express';
import { CoursesController } from '../controllers/courses.controller.js';

const router = express.Router();

router.get('/', CoursesController.getCourses);
router.get('/:id', CoursesController.getCourseById);

export default router;
