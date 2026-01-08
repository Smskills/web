import { Request, Response, NextFunction } from 'express';
import { CoursesService } from '../services/courses.service';
import { sendResponse } from '../utils/response';

export class CoursesController {
  static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CoursesService.fetchActivePrograms();
      return sendResponse(res, 200, true, 'Courses retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await CoursesService.fetchCourseDetails(id);
      return sendResponse(res, 200, true, 'Course details retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}