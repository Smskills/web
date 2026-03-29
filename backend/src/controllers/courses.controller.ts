import { Request, Response, NextFunction } from 'express';
import { CoursesService } from '../services/courses.service.ts';
import { sendResponse } from '../utils/response.ts';

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
      // Fix: Cast req to any to access params as the current Request type definition in this environment lacks it
      const { id } = (req as any).params;
      const data = await CoursesService.fetchCourseDetails(id);
      return sendResponse(res, 200, true, 'Course details retrieved', data);
    } catch (error) {
      next(error);
    }
  }
}