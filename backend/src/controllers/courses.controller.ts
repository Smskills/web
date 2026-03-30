
import { Request, Response, NextFunction } from 'express';
import { CoursesService } from '../services/courses.service.ts';
import { sendResponse } from '../utils/response.ts';

export class CoursesController {
  static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CoursesService.getCourses();
      return sendResponse(res, 200, true, 'Courses fetched successfully', courses);
    } catch (err) {
      next(err);
    }
  }

  static async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CoursesService.createCourse(req.body);
      return sendResponse(res, 201, true, 'Course created successfully', course);
    } catch (err) {
      next(err);
    }
  }

  static async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const course = await CoursesService.updateCourse(id as string, req.body);
      return sendResponse(res, 200, true, 'Course updated successfully', course);
    } catch (err) {
      next(err);
    }
  }

  static async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await CoursesService.deleteCourse(id as string);
      return sendResponse(res, 200, true, 'Course deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}
