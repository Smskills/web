import { CoursesRepository } from '../repositories/courses.repo';

export class CoursesService {
  static async fetchActivePrograms() {
    // Logic: Fetch and perhaps format or filter further based on complex rules
    const courses = await CoursesRepository.getAll();
    return courses;
  }

  static async fetchCourseDetails(id: string) {
    const course = await CoursesRepository.getById(id);
    if (!course) {
      const error: any = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    return course;
  }
}