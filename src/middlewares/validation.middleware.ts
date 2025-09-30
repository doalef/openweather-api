import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AppError } from '../utils/appError';
// import { AppError } from '../utils/AppError';

export function validateDto<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      
      const errors = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false }
      });

      if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        throw new AppError('Validation failed', 400, formattedErrors);
      }

      // Replace body with validated and transformed data
      req.body = dtoInstance;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.query);
      
      const errors = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false }
      });

      if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        // throw new AppError('Query validation failed', 400, formattedErrors);
      }

      // Replace query with validated and transformed data
      req.query = dtoInstance as any;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateParams<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.params);
      
      const errors = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false }
      });

      if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        // throw new AppError('Params validation failed', 400, formattedErrors);
      }

      // Replace params with validated and transformed data
      req.params = dtoInstance as any;
      next();
    } catch (error) {
      next(error);
    }
  };
}

function formatValidationErrors(errors: ValidationError[]): any[] {
  return errors.map(error => {
    const constraints = error.constraints ? Object.values(error.constraints) : [];
    return {
      property: error.property,
      constraints,
      value: error.value
    };
  });
}