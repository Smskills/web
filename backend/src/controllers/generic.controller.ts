import { Request, Response, NextFunction } from 'express';
import { GenericService } from '../services/generic.service.ts';
import { sendResponse } from '../utils/response.ts';

export class GenericController {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await GenericService.findAll(this.table);
      return sendResponse(res, 200, true, `${this.table} fetched successfully`, data);
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const data = await GenericService.findOne(this.table, id);
      if (!data) return sendResponse(res, 404, false, `${this.table} not found`);
      return sendResponse(res, 200, true, `${this.table} fetched successfully`, data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await GenericService.create(this.table, req.body);
      return sendResponse(res, 201, true, `${this.table} created successfully`, data);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const data = await GenericService.update(this.table, id, req.body);
      return sendResponse(res, 200, true, `${this.table} updated successfully`, data);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await GenericService.delete(this.table, id);
      return sendResponse(res, 200, true, `${this.table} deleted successfully`);
    } catch (err) {
      next(err);
    }
  };
}
