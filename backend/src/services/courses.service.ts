import { CoursesRepository } from '../repositories/courses.repo.ts';
import { mapToCamelCase } from '../utils/mapper.ts';

export class CoursesService {
  static async fetchActivePrograms() {
    const courses = await CoursesRepository.getAll();
    return mapToCamelCase(courses);
  }

  static async fetchCourseDetails(id: string) {
    const course = await CoursesRepository.getById(id);
    if (!course) {
      const error: any = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    return mapToCamelCase(course);
  }
}