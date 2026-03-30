
import { Request, Response, NextFunction } from 'express';
import pool from '../config/database.ts';
import { sendResponse } from '../utils/response.ts';
import { GenericRepository } from '../repositories/generic.repo.ts';
import { mapToCamelCase } from '../utils/mapper.ts';

export class ConfigController {
  static async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await GenericRepository.findOne('site_config', 1);
      if (!config || !config.config_json) {
        return sendResponse(res, 200, true, 'Config fetched', null);
      }
      
      const parsedConfig = JSON.parse(config.config_json);
      return sendResponse(res, 200, true, 'Config fetched', parsedConfig);
    } catch (err) {
      next(err);
    }
  }

  static async updateConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const newConfig = req.body;
      const configJson = JSON.stringify(newConfig);
      
      await GenericRepository.update('site_config', 1, { config_json: configJson });
      
      return sendResponse(res, 200, true, 'Config updated successfully', newConfig);
    } catch (err) {
      next(err);
    }
  }
}
