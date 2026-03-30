
import { CoursesRepository } from '../repositories/courses.repo.ts';
import { mapToCamelCase, mapToSnakeCase } from '../utils/mapper.ts';

export class CoursesService {
  static async getCourses() {
    const courses = await CoursesRepository.getAll();
    return mapToCamelCase(courses);
  }

  static async createCourse(courseData: any) {
    const snakeCaseData = mapToSnakeCase(courseData);
    const id = await CoursesRepository.create(snakeCaseData);
    return { id, ...courseData };
  }

  static async updateCourse(id: string | number, courseData: any) {
    const snakeCaseData = mapToSnakeCase(courseData);
    await CoursesRepository.update(id, snakeCaseData);
    return { id, ...courseData };
  }

  static async deleteCourse(id: string | number) {
    return await CoursesRepository.delete(id);
  }
}
