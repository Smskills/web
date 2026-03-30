import { GenericRepository } from '../repositories/generic.repo.ts';
import { mapToCamelCase, mapToSnakeCase } from '../utils/mapper.ts';

export class GenericService {
  static async findAll(table: string) {
    const rows = await GenericRepository.findAll(table);
    return mapToCamelCase(rows);
  }

  static async findOne(table: string, id: number | string) {
    const row = await GenericRepository.findOne(table, id);
    return row ? mapToCamelCase(row) : null;
  }

  static async create(table: string, data: any) {
    const snakeCaseData = mapToSnakeCase(data);
    const id = await GenericRepository.create(table, snakeCaseData);
    return { id, ...data };
  }

  static async update(table: string, id: number | string, data: any) {
    const snakeCaseData = mapToSnakeCase(data);
    await GenericRepository.update(table, id, snakeCaseData);
    return { id, ...data };
  }

  static async delete(table: string, id: number | string) {
    return await GenericRepository.delete(table, id);
  }
}
